"use client";

import React from "react";
import { Users, CheckCircle, PlaneTakeoff, HeartPulse } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

// Mock Data
const stats = [
  { label: "Total Applications", value: "1,245", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Visas Approved", value: "842", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Medicals Passed", value: "1,102", icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-100" },
  { label: "Flights Scheduled", value: "650", icon: PlaneTakeoff, color: "text-purple-600", bg: "bg-purple-100" },
];

const countryData = [
  { name: 'UAE', applicants: 400 },
  { name: 'Qatar', applicants: 300 },
  { name: 'Saudi Arabia', applicants: 350 },
  { name: 'Kuwait', applicants: 200 },
  { name: 'Oman', applicants: 150 },
];

const conversionData = [
  { month: 'Jan', applied: 100, approved: 60 },
  { month: 'Feb', applied: 120, approved: 80 },
  { month: 'Mar', applied: 170, approved: 100 },
  { month: 'Apr', applied: 140, approved: 110 },
  { month: 'May', applied: 200, approved: 150 },
];

export default function AdminAnalytics() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 mt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agency Performance Overview</h2>
          <p className="text-slate-500 mt-1">High-level metrics for your recruitment pipeline.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Country Chart */}
        <div className="border border-slate-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Applicants by Target Country</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="applicants" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Chart */}
        <div className="border border-slate-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Application vs. Approval Rate</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="applied" stroke="#94a3b8" strokeWidth={3} dot={{r: 4, fill: '#94a3b8', strokeWidth: 0}} />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
