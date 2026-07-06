import Link from "next/link";
import { ArrowRight, UserPlus, LogIn, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
          Manpower <span className="text-blue-600">Agency</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          The all-in-one portal for overseas recruitment. Track your applications, manage medical & visa statuses, and securely download offer letters.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
            <UserPlus size={20} /> New Candidate
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2">
            <LogIn size={20} /> Login
          </Link>
        </div>

        <div className="pt-16 border-t border-slate-200 mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
           <Link href="/admin" className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
             <LayoutDashboard className="text-blue-600 mb-4" size={32} />
             <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-600">Admin Dashboard Preview <ArrowRight size={18} className="inline ml-1" /></h3>
             <p className="text-slate-500 text-sm mt-2">View analytics, process applications, and manage tracking timelines.</p>
           </Link>
           <Link href="/candidate" className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group">
             <LayoutDashboard className="text-blue-600 mb-4" size={32} />
             <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-600">Candidate Dashboard Preview <ArrowRight size={18} className="inline ml-1" /></h3>
             <p className="text-slate-500 text-sm mt-2">View live tracking statuses, interviews, and download secure documents.</p>
           </Link>
        </div>
      </div>
    </div>
  );
}
