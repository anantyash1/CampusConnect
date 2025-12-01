import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface NavbarProps {
  role?: 'teacher' | 'student';
}

export default function Navbar({ role }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            Student Management System
          </Link>
          
          <div className="flex items-center space-x-4">
            {role && (
              <>
                <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}