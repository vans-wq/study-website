// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");

//   const handleLogin = async () => {
//     setError("");

//     const res = await fetch("/api/login", {
//       method: "POST",
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//       router.push("/dashboard");
//     } else {
//       setError("Invalid username or password");
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="bg-white p-6 shadow rounded w-80">
//         <h1 className="text-xl mb-4 font-semibold">Login</h1>

//         <input
//           placeholder="Username"
//           className="border w-full mb-2 p-2"
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border w-full mb-3 p-2"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         {error && (
//           <p className="text-red-500 text-sm mb-2">{error}</p>
//         )}

//         <button
//           onClick={handleLogin}
//           className="bg-blue-600 text-white w-full p-2 rounded"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    console.log("LOGIN RESULT:", data, error);
if (data?.user) {
  setTimeout(() => {
    router.replace("/dashboard");
  }, 100);



} else {
  setError("Login failed");
}
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 shadow rounded w-80">
        <h1 className="text-xl mb-4 font-semibold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full mb-2 p-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full mb-3 p-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}