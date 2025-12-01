// import { useState, useEffect } from 'react';
// import { signIn, getSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import AnimatedBackground from '@/components/AnimatedBackground';
// import Image from 'next/image';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Check if user is already logged in
//   useEffect(() => {
//     const checkSession = async () => {
//       const session = await getSession();
//       if (session?.user) {
//         redirectBasedOnRole(session.user.role);
//       }
//     };
//     checkSession();
//   }, []);

//   const redirectBasedOnRole = (role: string | null | undefined) => {
//     if (role === 'teacher') {
//       router.push('/teacher/dashboard');
//     } else if (role === 'student') {
//       router.push('/student/dashboard');
//     } else if (role === null) {
//       router.push('/auth/role-selection');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const result = await signIn('credentials', {
//         username,
//         password,
//         redirect: false,
//       });

//       if (result?.error) {
//         toast.error('Invalid credentials');
//       } else if (result?.ok) {
//         toast.success('Login successful!');
        
//         // Get the session to check user role
//         const session = await getSession();
//         if (session?.user) {
//           redirectBasedOnRole(session.user.role);
//         }
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       await signIn('google', { callbackUrl: '/pages/auth/role-selection' });
//     } catch (error) {
//       toast.error('Google sign in failed');
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>Login - Student Management System</title>
//       </Head>

//       <AnimatedBackground />

//       <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto">
        
//         {/* Left Half - Image */}
//         <div className="hidden md:flex w-1/2 h-full relative overflow-visible">
//           <div className="absolute inset-0 animate-float flex justify-center items-center">
//             <Image
//               src="/login-side.png"
//               alt="Login Illustration"
//               fill
//               priority
//               className="object-contain opacity-95 scale-105"
//             />
//           </div>
//         </div>

//         {/* Right Half - Login Form */}
//         <div className="md:w-1/2 w-full flex justify-center items-center px-6">
//           <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl text-center">
//             <h2 className="text-4xl font-extrabold text-white mb-6">Sign in to your account</h2>

//             {/* Google Sign In Button */}
//             <button
//               onClick={handleGoogleSignIn}
//               className="w-full mb-6 flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-100 transition transform hover:scale-[1.02]"
//             >
//               <Image src="/google.png" alt="Google" width={20} height={20} />
//               Sign in with Google
//             </button>

//             <div className="relative mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300/30"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-transparent text-gray-300">Or continue with username</span>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label htmlFor="username" className="block text-left text-gray-200 font-semibold mb-1">
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   required
//                   placeholder="Enter your username"
//                   className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-left text-gray-200 font-semibold mb-1">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   placeholder="Enter your password"
//                   className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.03] disabled:opacity-50"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </button>

//               <div className="text-center mt-3">
//                 <Link href="/register" className="text-blue-400 hover:text-blue-300">
//                   Don't have an account? Register here
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-25px);
//           }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//       `}</style>
//     </>
//   );
// }


import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import Image from 'next/image';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        redirectBasedOnRole(session.user.role);
      }
    };
    checkSession();
  }, []);

  const redirectBasedOnRole = (role: string | null | undefined) => {
    if (role === 'teacher') {
      router.push('/teacher/dashboard');
    } else if (role === 'student') {
      router.push('/student/dashboard');
    } else if (role === null) {
      router.push('/auth/role-selection');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
      } else if (result?.ok) {
        toast.success('Login successful!');
        
        // Get the session to check user role
        const session = await getSession();
        if (session?.user) {
          redirectBasedOnRole(session.user.role);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // ✅ FIXED: Remove callbackUrl to let NextAuth handle the redirect
      await signIn('google');
    } catch (error) {
      toast.error('Google sign in failed');
    }
  };

  return (
    <>
      <Head>
        <title>Login - Student Management System</title>
      </Head>

      <AnimatedBackground />

      <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto">
        
        {/* Left Half - Image */}
        <div className="hidden md:flex w-1/2 h-full relative overflow-visible">
          <div className="absolute inset-0 animate-float flex justify-center items-center">
            <Image
              src="/login-side.png"
              alt="Login Illustration"
              fill
              priority
              className="object-contain opacity-95 scale-105"
            />
          </div>
        </div>

        {/* Right Half - Login Form */}
        <div className="md:w-1/2 w-full flex justify-center items-center px-6">
          <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-extrabold text-white mb-6">Sign in to your account</h2>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full mb-6 flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-100 transition transform hover:scale-[1.02]"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              Sign in with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">Or continue with username</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-left text-gray-200 font-semibold mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Enter your username"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-left text-gray-200 font-semibold mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.03] disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center mt-3">
                <Link href="/register" className="text-blue-400 hover:text-blue-300">
                  Don't have an account? Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}