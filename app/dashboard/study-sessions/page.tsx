"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudySessionsPage() {

  const [sessions, setSessions] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const limit = 10;

  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [semester, setSemester] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [page, subject, grade, semester]);

  const loadSessions = async () => {

    setLoading(true);

    let query = supabase
      .from("study_sessions")
      .select(`
        id,
        study_date,
        duration_minutes,
        note,
        schedules (
          subject,
          academic_years (
            grade_level,
            semester
          )
        )
      `, { count: "exact" })
      .order("study_date", { ascending: false })
      .range(page * limit, page * limit + limit - 1);

    if (subject) {
      query = query.ilike("schedules.subject", `%${subject}%`);
    }

    if (grade) {
      query = query.eq("schedules.academic_years.grade_level", grade);
    }

    if (semester) {
      query = query.eq("schedules.academic_years.semester", semester);
    }
    console.log("query", query)


const { data, error } = await query;

setLoading(false);

if (error) {
  console.log(error);
  alert("เกิดข้อผิดพลาด");
  return;
}

const invalidData = data?.some((s: any) => {
  const academicYear = s?.schedules?.academic_years;

  if (!academicYear) return true;

  // ถ้าเป็น array
  if (Array.isArray(academicYear)) {
    return !academicYear[0]?.grade_level;
  }

  // ถ้าเป็น object
  return !academicYear.grade_level;
});
if (invalidData) {
  alert("ข้อมูล ไม่พบในระบบ");
  window.location.reload();   // refresh หน้าเดิม
  return;
}

setSessions(data || []);

  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Study Sessions
      </h1>

      {/* Filters */}

      <div className="grid grid-cols-3 gap-3 mb-6">

        <input
          placeholder="Search subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border p-2"
        />

      </div>

      {/* List */}

      <div className="border rounded bg-white">

        {sessions.map((s) => (
          <div key={s.id} className="border-b p-3 text-sm">

            <div className="font-semibold">
              {s.schedules.subject}
            </div>

            <div className="text-gray-500">
              Grade {s.schedules.academic_years.grade_level} |
              Semester {s.schedules.academic_years.semester}
            </div>

            <div>
              {new Date(s.study_date).toLocaleDateString()} |{" "}
              {s.duration_minutes} min
            </div>

            <div className="text-gray-600">
              {s.note}
            </div>

          </div>
        ))}

        {sessions.length === 0 && !loading && (
          <div className="p-4 text-gray-400">
            No results
          </div>
        )}

      </div>

      {/* Pagination */}

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="border px-3 py-1 rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 rounded"
        >
          Next
        </button>

      </div>

    </div>
  );
}