"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";


export default function StudyPage() {
  const params = useParams();
  const scheduleId = params.scheduleId;

  const [showForm, setShowForm] = useState(false);

  const [studyDate, setStudyDate] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");

  const handleSave = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("study_sessions")
      .insert([
        {
          schedule_id: scheduleId,
          user_id: user?.id,
          study_date: studyDate,
          duration_minutes: duration,
          note: note,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Save failed");
    } else {
      alert("Saved!");
      setShowForm(false);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4 text-black">
        Study Session
      </h1>

      {/* <p className="mb-4">
        Schedule: {scheduleId}
      </p> */}

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded "
      >
        Add Study Session
      </button>

      {showForm && (
        <div className="mt-6 border p-4 rounded">

          <h2 className="font-semibold mb-3 text-black">
            New Study Session
          </h2>

          <input
            type="date"
            value={studyDate}
            onChange={(e) => setStudyDate(e.target.value)}
             className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            placeholder="Minutes"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <textarea
            placeholder="What did you study?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
             className="border-3 border-blue-500 rounded p-2 w-full mb-1 text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            onClick={handleSave}
            className="bg-green-500 text-black px-3 py-1 rounded"
          >
            Save
          </button>

        </div>
      )}

    </div>
  );
}
