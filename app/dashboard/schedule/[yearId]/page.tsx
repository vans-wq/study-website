
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SchedulePage() {
  const params = useParams();
  const yearId = params.yearId as string;

  const [yearData, setYearData] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [subjectName, setSubjectName] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    if (yearId) {
      fetchYear();
      fetchSchedules();
    }
  }, [yearId]);

  const fetchYear = async () => {
    const { data } = await supabase
      .from("academic_years")
      .select("*")
      .eq("id", yearId)
      .single();

    setYearData(data);
  };

  const fetchSchedules = async () => {
    const { data } = await supabase
      .from("schedules")
      .select("*")
      .eq("academic_year_id", yearId)
      .order("weekday");

    setSchedules(data || []);
  };

  const addSchedule = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login");

    const { error } = await supabase.from("schedules").insert([
      {
        academic_year_id: yearId,
        user_id: user.id,      // ต้องมี เพราะ NOT NULL
        subject: subjectName,  // เปลี่ยนจาก subject_name
        weekday: dayOfWeek,    // เปลี่ยนจาก day_of_week
        start_time: startTime,
        end_time: endTime,
      },
    ]);

    if (!error) {
      setShowModal(false);
      fetchSchedules();
    } else {
      alert(error.message);
    }
  };

  if (!yearData) {
    return <div className="p-6">Loading...</div>;
  }

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (

    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-black">
        Academic Year {yearData.year_label}
      </h1>

      <p className="mb-4 text-black-600">
        Grade {yearData.grade_level} | Semester {yearData.semester}
      </p>

      <h2 className="text-xl font-bold mb-3">Subjects</h2>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + Add Subject
      </button>

      {schedules.length === 0 && (
        <p className="text-black-500">No subjects yet.</p>
      )}

      {schedules.map((item) => (
        <Link key={item.id} href={`/dashboard/study/${item.id}`}>
          <div className="bg-white p-3 mb-2 rounded shadow cursor-pointer hover:bg-gray-100">
            <div className="font-semibold">{item.subject}</div>

            <div className="text-sm text-black-600">

              {weekdays[item.weekday]} | {item.start_time} - {item.end_time}

            </div>
          </div>
        </Link>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="text-lg font-bold mb-4 text-black">Add Subject</h2>

            <label className="block text-sm mb-1 text-black">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
               className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <label className="block text-sm mb-1 text-black">Day (1-7)</label>
            <input
              type="number"
              min="1"
              max="7"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
               className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <label className="block text-sm mb-1 text-black">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <label className="block text-sm mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
               className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addSchedule}
                className="bg-blue-500 text-white px-3 py-1 rounded"
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

