// "use client";

// import DashboardLayout from "@/components/layout/dashboardlayout";

// export default function Dashboard() {
//   return (
//     <DashboardLayout>
//       <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
//     </DashboardLayout>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const [years, setYears] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [yearLabel, setYearLabel] = useState("");
  const [gradeLevel, setGradeLevel] = useState(1);
  const [semester, setSemester] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    const { data } = await supabase
      .from("academic_years")
      .select("*")
      .order("created_at", { ascending: false });

    setYears(data || []);
  };

  const addAcademicYear = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login");

    const { error } = await supabase.from("academic_years").insert([
      {
        user_id: user.id,
        year_label: yearLabel,
        grade_level: gradeLevel,
        semester: semester,
      },
    ]);

    if (!error) {
      setShowModal(false);
      setYearLabel("");
      fetchYears();
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Academic Years</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add Academic Year
      </button>


      {years.map((year) => (
  <div
    key={year.id}
onClick={() => router.push(`/dashboard/schedule/${year.id}`)}
    className="p-3 bg-white  mb-2 rounded shadow cursor-pointer hover:bg-gray-100 text-blue-600"
  >
          {year.year_label} - Grade {year.grade_level}- Semester {year.semester}
  </div>
))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="text-lg font-bold mb-4 text-black">Add Academic Year</h2>

            <input
              type="text"
              placeholder="Year (e.g. 2568)"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
               className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

      <h2 className="text-lg font-bold mb-4"> Grade Level</h2>
            <input
              type="number"
              placeholder="Grade Level"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(Number(e.target.value))}
             className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
     <h2 className="text-lg font-bold mb-4 text-black"> Semester</h2>
            <input
              type="number"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex justify-end gap-2 text-black">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded text-black"
              >
                Cancel
              </button>
              <button
                onClick={addAcademicYear}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
