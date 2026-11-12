import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { getMockAppointments } from "@/lib/mockData";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "booked";

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    try {
      const db = getSupabase();

      if (user.role === "doctor") {
        const date = searchParams.get("date");
        const query = db
          .from("appointments")
          .select(
            "id, patient_id, doctor_id, slot_id, reason, status, created_at, patients(name, phone, age), slots!inner(slot_date, start_time)"
          )
          .eq("doctor_id", user.userId)
          .eq("status", "booked")
          .order("id", { ascending: true });

        const { data, error } = await query;
        if (!error && data) {
          const rows = data
            .map((a) => {
              const patient = Array.isArray(a.patients) ? a.patients[0] : a.patients;
              const slot = Array.isArray(a.slots) ? a.slots[0] : a.slots;
              return {
                id: a.id,
                patient_id: a.patient_id,
                patient_name: patient?.name,
                patient_phone: patient?.phone,
                patient_age: patient?.age,
                reason: a.reason,
                status: a.status,
                date: slot?.slot_date,
                start_time: slot?.start_time ? String(slot.start_time).slice(0, 5) : null,
              };
            })
            .filter((a) => (date ? a.date === date : true))
            .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));

          return NextResponse.json({ role: "doctor", appointments: rows });
        }
      } else {
        let query = db
          .from("appointments")
          .select(
            "id, patient_id, doctor_id, slot_id, reason, status, created_at, doctors(name, room, department_id), slots(slot_date, start_time)"
          )
          .eq("patient_id", user.userId)
          .order("created_at", { ascending: false });

        if (status !== "all") query = query.eq("status", status);

        const { data, error } = await query;
        if (!error && data) {
          const appointments = data.map((a) => {
            const doctor = Array.isArray(a.doctors) ? a.doctors[0] : a.doctors;
            const slot = Array.isArray(a.slots) ? a.slots[0] : a.slots;
            return {
              id: a.id,
              doctor_id: a.doctor_id,
              doctor_name: doctor?.name,
              room: doctor?.room,
              reason: a.reason,
              status: a.status,
              date: slot?.slot_date,
              start_time: slot?.start_time ? String(slot.start_time).slice(0, 5) : null,
            };
          });

          return NextResponse.json({ role: "patient", appointments });
        }
      }
    } catch {
      // fallback to mock data
    }
  }

  // Fallback data when Supabase is not configured
  const mockRows = getMockAppointments(status, user.role);
  return NextResponse.json({ role: user.role, appointments: mockRows });
}
