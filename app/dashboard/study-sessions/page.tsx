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
  const [subjectInput, setSubjectInput] = useState("");
  const [gradeInput, setGradeInput] = useState("");
  const [semesterInput, setSemesterInput] = useState("");

useEffect(() => {
  loadSessions();
}, [page, subject, grade, semester]);

  const loadSessions = async () => {
console.log("subjectInput =", subjectInput);
console.log("subject =", subject);
    setLoading(true);

    let query = supabase
      .from("study_sessions")
     .select(`
  id,
  study_date,
  duration_minutes,
  note,
  schedules!inner (
    subject,
    academic_years!inner (
      grade_level,
      semester
    )
  )
`)
      .order("study_date", { ascending: false })
      .range(page * limit, page * limit + limit - 1);



    if (subject) {
      query = query.ilike("schedules.subject", `%${subject.trim()}%`);
    }

    if (grade) {
      query = query.eq("schedules.academic_years.grade_level", grade);
    }

    if (semester) {
      query = query.eq("schedules.academic_years.semester", semester);
    }
  


    const { data, error } = await query;
    console.log("data", data);
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

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  setSubject(subjectInput);
  setGrade(gradeInput);
  setSemester(semesterInput);

  setPage(0);


};
  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Study Sessions
      </h1>

      {/* Filters */}

      <div className="grid grid-cols-1 gap-3 mb-6">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-4 gap-3 mb-6"
        >

          <input
            placeholder="Subject"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            className="border p-2 w-full mb-1 placeholder-blue-400"
          />

          <input
            placeholder="Grade"
            value={gradeInput}
            onChange={(e) => setGradeInput(e.target.value)}
            className="border p-2 w-full mb-1 placeholder-blue-400"
          />

          <input
            placeholder="Semester"
            value={semesterInput}
            onChange={(e) => setSemesterInput(e.target.value)}
            className="border p-2 w-full mb-1 placeholder-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-600 text-black px-4 py-2 rounded"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setSubjectInput("");
              setGradeInput("");
              setSemesterInput("");
              setSubject("");
              setGrade("");
              setSemester("");
              setPage(0);
              loadSessions();
            }}
            className="border px-4 py-2 rounded"
          >
            Reset
          </button>
        </form>

      </div>

      {/* List */}

      <div className="border rounded bg-white">

        {sessions.map((s) => (
          <div key={s.id} className="border-b p-3 text-sm">

            <div className="font-semibold">
              {s.schedules.subject}
            </div>

            <div className="text-black-500">
              Grade {s.schedules.academic_years.grade_level} |
              Semester {s.schedules.academic_years.semester}
            </div>

            <div>
              {new Date(s.study_date).toLocaleDateString()} |{" "}
              {s.duration_minutes} min
            </div>

            <div className="text-black-600">
              {s.note}
            </div>

          </div>
        ))}

        {sessions.length === 0 && !loading && (
          <div className="p-4 text-black-400">
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


