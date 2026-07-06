import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import AdminAnalytics from "@/components/dashboard/AdminAnalytics";

// Ensure this page is rendered dynamically to always fetch fresh database data
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // 1. Validate the Session
  const session = await getServerSession();
  
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  // 2. Fetch all candidates directly from Prisma
  const rawCandidates = await prisma.candidate.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 3. Serialize Date objects for passing to the Client Component
  const candidates = rawCandidates.map(c => ({
    id: c.id,
    firstName: c.firstName,
    surname: c.surname,
    jobAppliedFor: c.jobAppliedFor,
    countryAppliedFor: c.countryAppliedFor,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Client component for interactive table */}
      <AdminDashboard initialCandidates={candidates} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20 mt-8">
        <AdminAnalytics />
      </div>
    </div>
  );
}
