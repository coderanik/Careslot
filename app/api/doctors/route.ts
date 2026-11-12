import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { MOCK_DEPARTMENTS, MOCK_DOCTORS } from "@/lib/mockData";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("department_id");
  const language = searchParams.get("language");
  const q = searchParams.get("q");

  let doctors = MOCK_DOCTORS;
  let departments = MOCK_DEPARTMENTS;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    try {
      let query = getSupabase()
        .from("doctors")
        .select(
          "id, name, department_id, qualification, experience_years, consultation_fee, languages, room, departments(id, name)"
        )
        .order("name", { ascending: true });

      if (departmentId) query = query.eq("department_id", departmentId);

      const { data, error } = await query;
      if (!error && data) {
        doctors = data as unknown as typeof MOCK_DOCTORS;
      }

      const { data: deptData, error: deptError } = await getSupabase()
        .from("departments")
        .select("id, name, common_issues")
        .order("name");
      if (!deptError && deptData) {
        departments = deptData;
      }
    } catch {
      // fallback to mock data
    }
  }

  let filtered = doctors;
  if (departmentId) {
    filtered = filtered.filter((d) => d.department_id === departmentId);
  }
  if (language) {
    const lang = language.toLowerCase();
    filtered = filtered.filter((d) =>
      (d.languages as string[] | null)?.some((l) => l.toLowerCase().includes(lang))
    );
  }
  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.qualification.toLowerCase().includes(needle) ||
        (Array.isArray(d.departments)
          ? d.departments[0]?.name?.toLowerCase().includes(needle)
          : (d.departments as { name?: string } | null)?.name?.toLowerCase().includes(needle))
    );
  }

  return NextResponse.json({ doctors: filtered, departments });
}
