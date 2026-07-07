"use client";

import React from "react";
import { Clock, CheckCircle, Download, ShieldCheck, FileText, FileBadge, AlertTriangle } from "lucide-react";

export default function CandidateDashboard({ candidate, documents }: { candidate: any, documents: any[] }) {
  
  // Tailwind badging logic for different statuses
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-bold"><Clock size={16}/> Under Processing</span>;
      case 'FIT_FOR_APPLY_PENDING':
        return <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold"><CheckCircle size={16}/> Fit for Apply</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold"><CheckCircle size={16}/> Approved</span>;
      default:
        return <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold"><Clock size={16}/> {status.replace(/_/g, ' ')}</span>;
    }
  };

  return (
    <div className="pt-10 px-6 md:px-10 max-w-6xl mx-auto font-sans pb-20">
      
      {/* 1. Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {candidate.firstName}! 👋
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Track your overseas application progress and manage your documents securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Status & CV */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Status Card */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Current Status</h2>
            <div className="mb-4">
              {getStatusBadge(candidate.status)}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              You applied for <strong className="text-slate-900">{candidate.jobAppliedFor}</strong> in <strong className="text-slate-900">{candidate.countryAppliedFor}</strong> on {new Date(candidate.createdAt).toLocaleDateString()}.
            </p>
          </div>

          {/* CV Download Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg shadow-blue-500/30 text-white relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <FileBadge size={28} className="text-blue-200" />
              <h2 className="text-lg font-bold">Your Official CV</h2>
            </div>
            <p className="text-blue-100 text-sm mb-6 relative z-10">
              Your profile data has been automatically compiled into an agency-formatted CV.
            </p>
            <a 
              href={`/api/generate-cv?candidateId=${candidate.id}`} 
              className="w-full bg-white text-blue-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm relative z-10"
            >
              <Download size={18} /> Download My CV
            </a>
          </div>
        </div>

        {/* Right Column: Documents & Updates */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden h-full flex flex-col">
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> Updates for My Application
              </h2>
              <p className="text-slate-500 mt-1 text-sm">Secure documents uploaded by your agency administrator.</p>
            </div>

            {/* Document List */}
            <div className="p-6 md:p-8 flex-1">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FileText size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg">No documents yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mt-2">
                    When the admin uploads your Offer Letter or Visa documents, they will securely appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{doc.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">Uploaded on {new Date(doc.createdAt).toLocaleDateString()}</p>
                          {doc.isEncrypted && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-600 mt-2 bg-emerald-50 px-2 py-1 rounded-md">
                              <ShieldCheck size={12} /> Encrypted PDF
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <a 
                        href={`/api/document?id=${doc.id}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
                      >
                        <Download size={16} /> Download
                      </a>
                    </div>
                  ))}

                  {/* Password Instructions Alert (UI Requirement) */}
                  <div className="mt-8 bg-blue-50/50 border border-blue-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-4">
                    <AlertTriangle className="text-blue-500 shrink-0 md:mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-blue-900">How to open your encrypted documents</h4>
                      <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                        🔒 Your document is password protected for your security. To open it, use the <strong>first 4 letters of your first name</strong> (in lowercase) followed by your <strong>birth year</strong>.
                      </p>
                      
                      <div className="mt-4 bg-white border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <p className="text-xs text-slate-600">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-1">Example</span>
                          Name is "Ramesh", born in "1995"
                        </p>
                        <div className="hidden sm:block w-px h-8 bg-blue-100 mx-2"></div>
                        <p className="text-xs text-slate-600">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-1">Your Password</span>
                          <span className="text-blue-700 font-mono font-bold text-sm bg-blue-50 px-2 py-1 rounded border border-blue-100">rame1995</span>
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
