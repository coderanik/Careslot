import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

/** Public list of departments for the doctor registration form. */
export async function GET() {
  const { data, error } = await getSupabase()
    .from("departments")
    .select("id, name")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ departments: data ?? [] });
}
