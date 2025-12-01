import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import Image from 'next/image';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (username.length < 5) {
      toast.error('Username must be at least 5 characters long');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Signing you in...');
        
        // Auto sign in after registration
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (result?.ok) {
          // Redirect based on role
          if (role === 'teacher') {
            router.push('/teacher/dashboard');
          } else {
            router.push('/student/dashboard');
          }
        }
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - Student Management System</title>
      </Head>

      <AnimatedBackground />

      <div className="h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto">
        
        {/* Left Half - Image */}
        <div className="hidden md:flex w-1/2 h-full relative overflow-visible">
          <div className="absolute inset-0 animate-float flex justify-center items-center">
            <Image
              src="/register-side.png"
              alt="Register Illustration"
              fill
              priority
              className="object-contain opacity-95 scale-105"
            />
          </div>
        </div>

        {/* Right Half - Register Form */}
        <div className="md:w-1/2 w-full flex justify-center items-center px-6">
          <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-extrabold text-white mb-6">Create Your Account</h2>

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
                  placeholder="Enter username (min 5 characters)"
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
                  placeholder="Enter password (min 6 characters)"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-left text-gray-200 font-semibold mb-1">
                  I am a:
                </label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      role === 'student' 
                        ? 'border-blue-500 bg-blue-500/20 text-white' 
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                    onClick={() => setRole('student')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      role === 'teacher' 
                        ? 'border-purple-500 bg-purple-500/20 text-white' 
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                    onClick={() => setRole('teacher')}
                  >
                    Teacher
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.03] disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>

              <div className="text-center mt-3">
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                  Already have an account? Login here
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