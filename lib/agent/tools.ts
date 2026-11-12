import "server-only";
import { z } from "zod";
import { defineTool, type AgentTool } from "./defineTool";
import { getSupabase } from "../supabase";
import { isoDate } from "../schemas";
import { requireSession } from "../session";

/*
 * CareSlot clinic tools. Gemini picks which tool to call.
 * Zod validates arguments. This code talks to Supabase.
 * Write tools always use the logged-in patient from the JWT — never trust a patient id from the model.
 */

const searchDoctors = defineTool({
  name: "searchDoctors",
  description:
    "Use this when the patient describes a symptom or asks for doctors by department or language. Matches departments via common_issues, then returns matching doctors. Prefer this before booking.",
  schema: z.object({
    issue: z
      .string()
      .trim()
      .min(2)
      .max(120)
      .optional()
      .describe("Symptom or reason in plain words, for example skin rash or knee pain"),
    department_id: z
      .string()
      .trim()
      .min(2)
      .max(10)
      .optional()
      .describe("Department id like D02 if already known"),
    language: z
      .string()
      .trim()
      .min(2)
      .max(30)
      .optional()
      .describe("Preferred spoken language, for example Tamil or Hindi"),
  }),
  run: async ({ issue, department_id, language }) => {
    await requireSession("patient");
    const db = getSupabase();

    let departmentIds: string[] | null = null;
    let matchedDepartments: { id: string; name: string; common_issues: string }[] = [];

    if (department_id) {
      const { data, error } = await db
        .from("departments")
        .select("id, name, common_issues")
        .eq("id", department_id);
      if (error) throw new Error(error.message);
      matchedDepartments = data ?? [];
      departmentIds = matchedDepartments.map((d) => d.id);
    } else if (issue) {
      const { data, error } = await db.from("departments").select("id, name, common_issues");
      if (error) throw new Error(error.message);
      const needle = issue.toLowerCase();
      matchedDepartments = (data ?? []).filter(
        (d) =>
          d.name.toLowerCase().includes(needle) ||
          d.common_issues.toLowerCase().includes(needle) ||
          needle.split(/\s+/).some((w) => w.length > 3 && d.common_issues.toLowerCase().includes(w))
      );
      if (matchedDepartments.length === 0) {
        matchedDepartments = (data ?? []).filter((d) => d.id === "D01");
      }
      departmentIds = matchedDepartments.map((d) => d.id);
    }

    let query = db
      .from("doctors")
      .select(
        "id, name, department_id, qualification, experience_years, consultation_fee, languages, room, departments(name)"
      )
      .order("experience_years", { ascending: false })
      .limit(20);

    if (departmentIds && departmentIds.length > 0) {
      query = query.in("department_id", departmentIds);
    }

    const { data: doctors, error: docError } = await query;
    if (docError) throw new Error(docError.message);

    let filtered = doctors ?? [];
    if (language) {
      const lang = language.toLowerCase();
      filtered = filtered.filter((d) =>
        (d.languages as string[] | null)?.some((l) => l.toLowerCase().includes(lang))
      );
    }

    return {
      matched_departments: matchedDepartments.map((d) => ({
        id: d.id,
        name: d.name,
        common_issues: d.common_issues,
      })),
      count: filtered.length,
      doctors: filtered.map((d) => ({
        id: d.id,
        name: d.name,
        department_id: d.department_id,
        department_name: Array.isArray(d.departments)
          ? d.departments[0]?.name
          : (d.departments as { name?: string } | null)?.name,
        qualification: d.qualification,
        experience_years: d.experience_years,
        consultation_fee: d.consultation_fee,
        languages: d.languages,
        room: d.room,
      })),
    };
  },
});

const getAvailableSlots = defineTool({
  name: "getAvailableSlots",
  description:
    "Use this when the patient wants free appointment times for a doctor on a date or date range. Returns only slots where is_booked is false. Morning means before 12:00.",
  schema: z.object({
    doctor_id: z.string().trim().min(2).max(10).describe("Doctor id, for example DR03"),
    date: isoDate.optional().describe("Exact day YYYY-MM-DD. Prefer this when the patient named one day."),
    from_date: isoDate.optional().describe("Start of range YYYY-MM-DD when searching a window"),
    to_date: isoDate.optional().describe("End of range YYYY-MM-DD when searching a window"),
    morning_only: z
      .boolean()
      .optional()
      .describe("If true, only return slots with start_time before 12:00"),
  }),
  run: async ({ doctor_id, date, from_date, to_date, morning_only }) => {
    await requireSession("patient");
    const db = getSupabase();

    const { data: doctor, error: doctorError } = await db
      .from("doctors")
      .select("id, name, department_id")
      .eq("id", doctor_id)
      .maybeSingle();
    if (doctorError) throw new Error(doctorError.message);
    if (!doctor) throw new Error(`No doctor found with id ${doctor_id}`);

    let query = db
      .from("slots")
      .select("id, doctor_id, slot_date, start_time, is_booked")
      .eq("doctor_id", doctor_id)
      .eq("is_booked", false)
      .order("slot_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(40);

    if (date) {
      query = query.eq("slot_date", date);
    } else {
      if (from_date) query = query.gte("slot_date", from_date);
      if (to_date) query = query.lte("slot_date", to_date);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    let slots = data ?? [];
    if (morning_only) {
      slots = slots.filter((s) => String(s.start_time).slice(0, 5) < "12:00");
    }

    return {
      doctor,
      count: slots.length,
      slots: slots.map((s) => ({
        id: s.id,
        date: s.slot_date,
        start_time: String(s.start_time).slice(0, 5),
      })),
    };
  },
});

const bookAppointment = defineTool({
  name: "bookAppointment",
  description:
    "Use this when the patient confirms a free slot and wants to book it. Marks the slot as booked and creates an appointment for the logged-in patient. A slot can be booked only once.",
  writes: true,
  schema: z.object({
    slot_id: z.number().int().positive().describe("The free slot id from getAvailableSlots"),
    reason: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .describe("Short reason for the visit, for example skin rash"),
  }),
  run: async ({ slot_id, reason }) => {
    const patient = await requireSession("patient");
    const db = getSupabase();

    const { data: slot, error: slotError } = await db
      .from("slots")
      .update({ is_booked: true })
      .eq("id", slot_id)
      .eq("is_booked", false)
      .select("id, doctor_id, slot_date, start_time")
      .maybeSingle();
    if (slotError) throw new Error(slotError.message);
    if (!slot) throw new Error(`Slot ${slot_id} is not available. Pick another free slot.`);

    const { data: appointment, error: apptError } = await db
      .from("appointments")
      .insert({
        patient_id: patient.userId,
        doctor_id: slot.doctor_id,
        slot_id: slot.id,
        reason,
        status: "booked",
      })
      .select("id, patient_id, doctor_id, slot_id, reason, status, created_at")
      .single();

    if (apptError) {
      await db.from("slots").update({ is_booked: false }).eq("id", slot_id);
      throw new Error(apptError.message);
    }

    const { data: doctor } = await db.from("doctors").select("id, name, room").eq("id", slot.doctor_id).maybeSingle();

    return {
      booked: {
        appointment_id: appointment.id,
        doctor: doctor ?? { id: slot.doctor_id },
        date: slot.slot_date,
        start_time: String(slot.start_time).slice(0, 5),
        reason: appointment.reason,
        status: appointment.status,
      },
    };
  },
});

const rescheduleAppointment = defineTool({
  name: "rescheduleAppointment",
  description:
    "Use this when the patient wants to move an existing booked appointment to a different free slot. Frees the old slot and books the new one. Call getMyAppointments and getAvailableSlots first if ids are unknown.",
  writes: true,
  schema: z.object({
    appointment_id: z.number().int().positive().describe("Existing appointment id to move"),
    new_slot_id: z.number().int().positive().describe("New free slot id"),
  }),
  run: async ({ appointment_id, new_slot_id }) => {
    const patient = await requireSession("patient");
    const db = getSupabase();

    const { data: appt, error: apptError } = await db
      .from("appointments")
      .select("id, patient_id, doctor_id, slot_id, reason, status")
      .eq("id", appointment_id)
      .eq("patient_id", patient.userId)
      .maybeSingle();
    if (apptError) throw new Error(apptError.message);
    if (!appt) throw new Error(`No appointment ${appointment_id} found for you`);
    if (appt.status !== "booked") throw new Error(`Appointment ${appointment_id} is ${appt.status}, not booked`);

    const { data: newSlot, error: newSlotError } = await db
      .from("slots")
      .update({ is_booked: true })
      .eq("id", new_slot_id)
      .eq("is_booked", false)
      .select("id, doctor_id, slot_date, start_time")
      .maybeSingle();
    if (newSlotError) throw new Error(newSlotError.message);
    if (!newSlot) throw new Error(`Slot ${new_slot_id} is not available`);

    const { data: updated, error: updateError } = await db
      .from("appointments")
      .update({ slot_id: newSlot.id, doctor_id: newSlot.doctor_id })
      .eq("id", appt.id)
      .select("id, doctor_id, slot_id, reason, status")
      .single();
    if (updateError) {
      await db.from("slots").update({ is_booked: false }).eq("id", new_slot_id);
      throw new Error(updateError.message);
    }

    await db.from("slots").update({ is_booked: false }).eq("id", appt.slot_id);

    return {
      rescheduled: {
        appointment_id: updated.id,
        doctor_id: updated.doctor_id,
        date: newSlot.slot_date,
        start_time: String(newSlot.start_time).slice(0, 5),
        reason: updated.reason,
        status: updated.status,
      },
    };
  },
});

const cancelAppointment = defineTool({
  name: "cancelAppointment",
  description:
    "Use this when the patient wants to cancel a booked appointment. Sets status to cancelled and frees the slot so someone else can book it.",
  writes: true,
  schema: z.object({
    appointment_id: z.number().int().positive().describe("Appointment id to cancel"),
  }),
  run: async ({ appointment_id }) => {
    const patient = await requireSession("patient");
    const db = getSupabase();

    const { data: appt, error: apptError } = await db
      .from("appointments")
      .select("id, patient_id, slot_id, status, reason")
      .eq("id", appointment_id)
      .eq("patient_id", patient.userId)
      .maybeSingle();
    if (apptError) throw new Error(apptError.message);
    if (!appt) throw new Error(`No appointment ${appointment_id} found for you`);
    if (appt.status !== "booked") throw new Error(`Appointment ${appointment_id} is already ${appt.status}`);

    const { data: updated, error: updateError } = await db
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appt.id)
      .select("id, status, reason, slot_id")
      .single();
    if (updateError) throw new Error(updateError.message);

    await db.from("slots").update({ is_booked: false }).eq("id", appt.slot_id);

    return { cancelled: updated };
  },
});

const getMyAppointments = defineTool({
  name: "getMyAppointments",
  description:
    "Use this when the patient asks about their appointments, upcoming visits, or needs an appointment id before rescheduling or cancelling.",
  schema: z.object({
    status: z
      .enum(["booked", "cancelled", "completed", "all"])
      .optional()
      .describe("Filter by status. Default is booked."),
  }),
  run: async ({ status }) => {
    const patient = await requireSession("patient");
    const db = getSupabase();
    const wanted = status ?? "booked";

    let query = db
      .from("appointments")
      .select(
        "id, patient_id, doctor_id, slot_id, reason, status, created_at, doctors(name, room), slots(slot_date, start_time)"
      )
      .eq("patient_id", patient.userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (wanted !== "all") query = query.eq("status", wanted);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return {
      patient_id: patient.userId,
      count: data?.length ?? 0,
      appointments: (data ?? []).map((a) => {
        const doctor = Array.isArray(a.doctors) ? a.doctors[0] : a.doctors;
        const slot = Array.isArray(a.slots) ? a.slots[0] : a.slots;
        return {
          id: a.id,
          doctor_id: a.doctor_id,
          doctor_name: doctor?.name,
          room: doctor?.room,
          date: slot?.slot_date,
          start_time: slot?.start_time ? String(slot.start_time).slice(0, 5) : null,
          reason: a.reason,
          status: a.status,
        };
      }),
    };
  },
});

/** Every tool in this list is given to Gemini. */
export const tools: AgentTool[] = [
  searchDoctors,
  getAvailableSlots,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getMyAppointments,
];
