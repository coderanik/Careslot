import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("department_id");
  const language = searchParams.get("language");
  const q = searchParams.get("q");

  let query = getSupabase()
    .from("doctors")
    .select(
      "id, name, department_id, qualification, experience_years, consultation_fee, languages, room, departments(id, name)"
    )
    .order("name", { ascending: true });

  if (departmentId) query = query.eq("department_id", departmentId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let doctors = data ?? [];
  if (language) {
    const lang = language.toLowerCase();
    doctors = doctors.filter((d) =>
      (d.languages as string[] | null)?.some((l) => l.toLowerCase().includes(lang))
    );
  }
  if (q) {
    const needle = q.toLowerCase();
    doctors = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.qualification.toLowerCase().includes(needle) ||
        (Array.isArray(d.departments)
          ? d.departments[0]?.name?.toLowerCase().includes(needle)
          : (d.departments as { name?: string } | null)?.name?.toLowerCase().includes(needle))
    );
  }

  const { data: departments } = await getSupabase()
    .from("departments")
    .select("id, name, common_issues")
    .order("name");

  return NextResponse.json({ doctors, departments: departments ?? [] });
}
