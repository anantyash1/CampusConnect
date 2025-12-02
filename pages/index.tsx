"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AcademicCapIcon,
  SparklesIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  XMarkIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  BoltIcon,
  BeakerIcon,
  BookOpenIcon,
  PresentationChartLineIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import Footer from "@/components/ui/Footer";

export default function LandingPage() {
  // const { data: session, status } = useSession();
  const router = useRouter();

  // Modal States (kept for potential use, but not active)
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [campusModalMode, setCampusModalMode] = useState<"login" | "register">("login");

  // Campus Form States (kept for potential use)
  const [campusEmail, setCampusEmail] = useState("");
  const [campusPassword, setCampusPassword] = useState("");
  const [campusName, setCampusName] = useState("");
  const [campusRole, setCampusRole] = useState<"teacher" | "student">("teacher");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [campusLoading, setCampusLoading] = useState(false);
  const [campusError, setCampusError] = useState("");

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const handleDashboardClick = () => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      // Redirect to login page
      router.push("/auth/login");
    }
  };

  // Handle Campus Connect - Redirect to Register
  const handleCampusConnectClick = () => {
    router.push("/auth/register");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50 to-white overflow-hidden">
      {/* Particles Background */}
      <Particles
        init={particlesInit}
        className="absolute inset-0 -z-10"
        options={{
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 90, density: { enable: true, area: 800 } },
            color: { value: ["#8b5cf6", "#3b82f6", "#ec4899"] },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 4, random: true },
            move: { enable: true, speed: 1.8 },
            links: { enable: true, distance: 140, color: "#8b5cf6", opacity: 0.15, width: 1 },
          },
          interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          detectRetina: true,
        }}
      />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold text-sm mb-8"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                The Future of Campus Management is Here
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
              >
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Campus Connect
                </span>
                <span className="block text-4xl sm:text-5xl mt-4 text-gray-800">
                  Manage. Track. Excel.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Track progress in real-time • Manage marks, exams, and attendance • AI-powered insights for better decisions • Complete student management in one platform.
              </motion.p>
              {/* ALL 4 BUTTONS – EQUAL SIZE, PERFECTLY ROUNDED */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-12 grid grid-cols-2 gap-4 max-w-3xl mx-auto lg:mx-0"
              >
                // Only modify the Get Started button inside your existing code:

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <AcademicCapIcon className="w-5 h-5" />
                  Get Started Free
                </Link>

                <button
                  onClick={handleDashboardClick}
                  className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-indigo-600 text-indigo-600 bg-white font-bold text-base rounded-xl hover:bg-indigo-50 hover:shadow-xl transition-all"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  Dashboard
                </button>
                
                <Link
                  href="/about"
                  className="flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-800 font-bold text-base rounded-xl hover:bg-gray-200 hover:shadow-xl transition-all"
                >
                  Learn More
                </Link>
              </motion.div>
              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 text-gray-600"
              >
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 text-green-500 mr-2" /> End-to-End Encrypted
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-6 h-6 text-indigo-500 mr-2" /> 50+ Institutions
                </div>
                <div className="flex items-center">
                  <SparklesIcon className="w-6 h-6 text-purple-500 mr-2" /> AI-Powered Insights
                </div>
              </motion.div>
            </div>
            {/* Right Image – Smaller Size with Better Spacing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full max-w-md mx-auto py-8">
                <div className="relative aspect-square">
                  <Image
                    src="/register-side.png"
                    alt="Campus Connect – Complete Student Management Platform"
                    fill
                    className="rounded-2xl shadow-2xl object-cover"
                    priority
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "10K+", label: "Active Students" },
              { value: "500+", label: "Teachers" },
              { value: "50+", label: "Institutions" },
              { value: "99%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="transform hover:scale-110 transition-all"
              >
                <div className="text-5xl font-extrabold mb-2">{stat.value}</div>
                <div className="text-purple-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURES SECTION */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              Powerful Tools for Campus Management
            </h2>
            <p className="mt-5 text-xl text-gray-600">Streamline operations with AI-driven efficiency</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <ChartBarIcon className="w-12 h-12" />,
                title: "Track Progress in Real-Time",
                desc: "Monitor assignments, quiz scores, and learning curves with AI insights and automated reports.",
                gradient: "from-indigo-500 to-blue-600",
              },
              {
                icon: <DocumentCheckIcon className="w-12 h-12" />,
                title: "Manage All Marks & Exams",
                desc: "Handle internal marks, unit tests, mid-terms, finals — plus custom grading for projects and behavior.",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: <div className="flex gap-3"><UserGroupIcon className="w-10 h-10" /><GlobeAltIcon className="w-10 h-10" /></div>,
                title: "Complete Student Management",
                desc: "Attendance tracking, parent communication, fee reminders, health records, and extracurricular activities — all in one place.",
                gradient: "from-pink-500 to-rose-600",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group bg-white p-10 rounded-3xl shadow-xl border border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-5 text-xl text-gray-600">Three simple steps to transform your campus</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                icon: <RocketLaunchIcon className="w-12 h-12" />,
                title: "Sign Up & Setup",
                desc: "Create your free account and add your institution, students, and teachers",
                color: "from-blue-500 to-indigo-600"
              },
              {
                step: "2",
                icon: <BoltIcon className="w-12 h-12" />,
                title: "AI Analyzes Data",
                desc: "Upload marks, attendance, and activities — AI generates insights and reports instantly",
                color: "from-purple-500 to-pink-600"
              },
              {
                step: "3",
                icon: <CheckCircleIcon className="w-12 h-12" />,
                title: "Manage & Improve",
                desc: "Access real-time dashboards, collaborate, and make data-driven decisions",
                color: "from-pink-500 to-rose-600"
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${step.color} text-white mb-6 shadow-xl`}>
                    {step.icon}
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-indigo-600 font-bold text-2xl text-indigo-600 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              Perfect for Every Institution
            </h2>
            <p className="mt-5 text-xl text-gray-600">Tailored for schools, colleges, and universities</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <BeakerIcon className="w-10 h-10" />, title: "K-12 Schools", desc: "Streamline daily attendance, homework tracking, and parent-teacher communication" },
              { icon: <BookOpenIcon className="w-10 h-10" />, title: "Colleges", desc: "Manage course registrations, exam scheduling, and alumni engagement" },
              { icon: <PresentationChartLineIcon className="w-10 h-10" />, title: "Universities", desc: "Handle research grants, faculty evaluations, and campus-wide analytics" },
              { icon: <AcademicCapIcon className="w-10 h-10" />, title: "Vocational Institutes", desc: "Track skill assessments, certification exams, and job placement metrics" },
              { icon: <ChartBarIcon className="w-10 h-10" />, title: "Online Academies", desc: "Monitor virtual class attendance, progress reports, and e-learning certifications" },
              { icon: <GlobeAltIcon className="w-10 h-10" />, title: "International Campuses", desc: "Centralize multi-location data, compliance reporting, and global student mobility" },
            ].map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-300 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              Institutions Love Campus Connect
            </h2>
            <p className="mt-5 text-xl text-gray-600">Join hundreds of successful schools worldwide</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Emily Carter",
                role: "Principal, Oakwood High School",
                image: "EC",
                quote: "Campus Connect transformed our administrative chaos into streamlined efficiency! Real-time progress tracking helped us identify at-risk students early, improving outcomes by 25%.",
                rating: 5
              },
              {
                name: "Prof. Raj Patel",
                role: "Dean, Tech University",
                image: "RP",
                quote: "The AI insights are revolutionary. Automated reports save our faculty hours each week, allowing more time for teaching. Integration with our LMS was seamless.",
                rating: 5
              },
              {
                name: "Ms. Lisa Wong",
                role: "Admin Director, Global Academy",
                image: "LW",
                quote: "Parent communication has never been better. Fee reminders and health records in one place — parents love the transparency and accessibility.",
                rating: 5
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-5 text-xl text-gray-600">Choose the plan that fits your institution</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "Basic student tracking",
                  "5 teachers max",
                  "Core reports",
                  "Email support"
                ],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Pro",
                price: "$29",
                period: "/month",
                features: [
                  "Unlimited students & teachers",
                  "AI insights & analytics",
                  "Custom grading & projects",
                  "Parent portal",
                  "Priority support",
                  "Integrations"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$99",
                period: "/month per campus",
                features: [
                  "Everything in Pro",
                  "Advanced AI recommendations",
                  "Multi-campus management",
                  "Custom API access",
                  "Dedicated manager",
                  "Compliance tools"
                ],
                cta: "Contact Sales",
                popular: false
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white p-8 rounded-3xl shadow-xl border-2 ${plan.popular ? "border-purple-600 scale-105" : "border-gray-200"
                  } hover:shadow-2xl transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full text-sm">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`block text-center py-4 font-bold rounded-xl transition-all ${plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl"
                      : "border-2 border-gray-300 text-gray-900 hover:border-purple-600"
                    }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "How does real-time tracking work?",
                a: "Connect your data sources, and our platform updates progress, attendance, and marks instantly. AI analyzes trends and sends alerts for intervention."
              },
              {
                q: "Can I customize grading systems?",
                a: "Yes! Support for rubrics, weighted scores, behavioral grading, and integration with existing LMS or SIS systems."
              },
              {
                q: "What's included in student management?",
                a: "Full suite: attendance, health records, fees, extracurriculars, parent portals, and compliance reporting — all centralized."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely! We use end-to-end encryption, GDPR/HIPAA compliance, and regular audits to protect sensitive student information."
              },
              {
                q: "Can I use this on mobile?",
                a: "Yes! Fully responsive web app with native iOS/Android apps for teachers and admins on the go."
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl lg:text-6xl font-extrabold mb-6">
              Ready to Transform Your Campus?
            </h2>
            <p className="text-2xl text-purple-100 mb-10">
              Join 50+ institutions already managing smarter with AI
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-3 px-12 py-5 bg-white text-purple-600 font-bold text-xl rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <RocketLaunchIcon className="w-7 h-7" />
              Start Free Today
            </Link>
            <p className="mt-6 text-purple-100">No credit card required • 100% free to start</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}




// import Link from "next/link";
// import Navbar from '@/components/Navbar';

// export default function Home() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">

//       <div className="text-center space-y-6">
//         <h1 className="text-5xl font-bold">Campus Connect</h1>

//         <Link
//           href="/login"
//           className="bg-blue-600 px-6 py-3 text-white rounded-xl hover:bg-blue-700"
//         >
//           Get Started
//         </Link>
//       </div>

//     </div>
//   );
// }
