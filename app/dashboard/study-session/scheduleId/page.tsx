"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function StudySessionPage() {
  const params = useParams();
  const scheduleId = params.scheduleId as string;

  const [sessions, setSessions] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [studyDate, setStudyDate] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ดึง subject
    const { data: schedule } = await supabase
      .from("schedules")
      .select("subject")
      .eq("id", scheduleId)
      .single();

    if (schedule) setSubject(schedule.subject);

    // ดึง sessions
    const { data } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("schedule_id", scheduleId)
      .eq("user_id", user?.id)
      .order("study_date", { ascending: false });

    if (data) setSessions(data);
  }

  async function handleSave() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("study_sessions").insert([
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
      return;
    }

    setShowModal(false);
    setStudyDate("");
    setDuration("");
    setNote("");

    loadData();
  }

  function totalMinutes() {
    return sessions.reduce(
      (sum, s) => sum + (s.duration_minutes || 0),
      0
    );
  }

  function formatTotal() {
    const minutes = totalMinutes();
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  return (
    <div className="p-6 max-w-xl">

      <h1 className="text-2xl font-bold mb-4">
        Subject: {subject}
      </h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Add Study Session
      </button>

      <h2 className="text-lg font-semibold mb-2">
        Today Study
      </h2>

      <div className="bg-white rounded shadow p-4 mb-6">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="border-b py-2 text-sm"
          >
            {new Date(s.study_date).toLocaleDateString()} |{" "}
            {s.duration_minutes} min | {s.note}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-gray-400">
            No study sessions yet
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold">
        Total Study Time
      </h2>

      <div className="text-xl font-bold">
        {formatTotal()}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-80">

            <h2 className="text-lg font-bold mb-4">
              Add Study Session
            </h2>

            <label className="text-sm">Date</label>
            <input
              type="date"
              value={studyDate}
              onChange={(e) => setStudyDate(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <label className="text-sm">Minutes</label>
            <input
              type="number"
              placeholder="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <label className="text-sm">Note</label>
            <textarea
              placeholder="Integration / Derivative"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border p-2 w-full mb-4"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
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