'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  role?: 'teacher' | 'student';
}

export default function Layout({ children, role }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-white">
      {/* Navbar */}
      <Navbar role={role} />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="content-overlay bg-sidebar-dark/70 p-6 rounded-xl shadow-lg border border-border/30 backdrop-blur-lg">
          {children}
        </div>
      </main>

      {/* Optional Footer */}
      <footer className="text-center py-4 text-sm text-gray-400 border-t border-border/20 mt-auto">
        © {new Date().getFullYear()} Student Management System. All rights reserved.
      </footer>
    </div>
  );
}
