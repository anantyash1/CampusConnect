// import { useEffect, useState } from "react";
// import { useSession, getSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import toast from "react-hot-toast";

// export default function RoleSelection() {
//   const { data: session, status, update } = useSession();
//   const router = useRouter();

//   const [role, setRole] = useState<"teacher" | "student">("student");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const checkSession = async () => {
//       const currentSession = await getSession();
      
//       if (currentSession?.user?.role) {
//         // User already has a role, redirect to dashboard
//         redirectToDashboard(currentSession.user.role);
//       } else if (status === "unauthenticated") {
//         // No session, redirect to login
//         router.push("/login");
//       }
//     };

//     checkSession();
//   }, [status, router]);

//   const redirectToDashboard = (userRole: string) => {
//     if (userRole === "teacher") {
//       router.push("/teacher/dashboard");
//     } else if (userRole === "student") {
//       router.push("/student/dashboard");
//     }
//   };

//   const saveRole = async () => {
//     if (!session?.user?.email) {
//       toast.error("No user session found");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/update-role", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           email: session.user.email, 
//           role,
//           username: session.user.name || session.user.email?.split('@')[0]
//         })
//       });

//       if (res.ok) {
//         // Update the session with the new role
//         await update({
//           ...session,
//           user: {
//             ...session.user,
//             role: role
//           }
//         });
        
//         toast.success(`Welcome, ${role}!`);
//         redirectToDashboard(role);
//       } else {
//         const error = await res.json();
//         toast.error(error.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.error("Role selection error:", error);
//       toast.error("Failed to save role");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-center">
//           <p>No session found. Redirecting to login...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
//       <div className="p-8 bg-white/10 rounded-xl w-full max-w-md border border-white/20">
//         <h1 className="text-3xl font-bold text-center mb-2">Welcome!</h1>
//         <p className="text-center text-gray-300 mb-6">
//           Please select your role to continue
//         </p>

//         <div className="space-y-4 mb-6">
//           <button
//             onClick={() => setRole("student")}
//             className={`w-full p-4 rounded-xl border-2 transition-all ${
//               role === "student" 
//                 ? "bg-blue-600 border-blue-400 scale-105" 
//                 : "bg-gray-700 border-gray-600 hover:bg-gray-600"
//             }`}
//           >
//             <div className="text-lg font-semibold">Student</div>
//             <div className="text-sm text-gray-300 mt-1">
//               Access assignments, grades, and course materials
//             </div>
//           </button>

//           <button
//             onClick={() => setRole("teacher")}
//             className={`w-full p-4 rounded-xl border-2 transition-all ${
//               role === "teacher" 
//                 ? "bg-purple-600 border-purple-400 scale-105" 
//                 : "bg-gray-700 border-gray-600 hover:bg-gray-600"
//             }`}
//           >
//             <div className="text-lg font-semibold">Teacher</div>
//             <div className="text-sm text-gray-300 mt-1">
//               Manage courses, assignments, and student progress
//             </div>
//           </button>
//         </div>

//         <button
//           onClick={saveRole}
//           disabled={loading}
//           className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? "Continuing..." : "Continue"}
//         </button>

//         <p className="text-center text-gray-400 text-sm mt-4">
//           Signed in as: {session.user?.email || session.user?.name}
//         </p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useSession, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function RoleSelection() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [role, setRole] = useState<"teacher" | "student">("student");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = await getSession();
      
      if (currentSession?.user?.role) {
        // User already has a role, redirect to dashboard
        redirectToDashboard(currentSession.user.role);
      } else if (status === "unauthenticated") {
        // No session, redirect to login
        router.push("/login");
      }
    };

    checkSession();
  }, [status, router]);

  const redirectToDashboard = (userRole: string) => {
    if (userRole === "teacher") {
      router.push("/teacher/dashboard");
    } else if (userRole === "student") {
      router.push("/student/dashboard");
    }
  };

  const saveRole = async () => {
    if (!session?.user?.email) {
      toast.error("No user session found");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session.user.email, 
          role,
          username: session.user.name || session.user.email?.split('@')[0]
        })
      });

      if (res.ok) {
        // Update the session with the new role
        await update({
          ...session,
          user: {
            ...session.user,
            role: role
          }
        });
        
        toast.success(`Welcome, ${role}!`);
        redirectToDashboard(role);
      } else {
        const error = await res.json();
        toast.error(error.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Role selection error:", error);
      toast.error("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p>No session found. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="p-8 bg-white/10 rounded-xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome!</h1>
        <p className="text-center text-gray-300 mb-6">
          Please select your role to continue
        </p>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => setRole("student")}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              role === "student" 
                ? "bg-blue-600 border-blue-400 scale-105" 
                : "bg-gray-700 border-gray-600 hover:bg-gray-600"
            }`}
          >
            <div className="text-lg font-semibold">Student</div>
            <div className="text-sm text-gray-300 mt-1">
              Access assignments, grades, and course materials
            </div>
          </button>

          <button
            onClick={() => setRole("teacher")}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              role === "teacher" 
                ? "bg-purple-600 border-purple-400 scale-105" 
                : "bg-gray-700 border-gray-600 hover:bg-gray-600"
            }`}
          >
            <div className="text-lg font-semibold">Teacher</div>
            <div className="text-sm text-gray-300 mt-1">
              Manage courses, assignments, and student progress
            </div>
          </button>
        </div>

        <button
          onClick={saveRole}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Continuing..." : "Continue"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-xl font-semibold transition"
        >
          Sign out
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Signed in as: {session.user?.email || session.user?.name}
        </p>
      </div>
    </div>
  );
}