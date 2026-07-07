import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CandidateDashboard from "@/components/dashboard/CandidateDashboard";
import { authOptions } from "@/lib/auth";

// Ensure this page is rendered dynamically to fetch real-time application and document data
export const dynamic = 'force-dynamic';

export default async function CandidatePage() {
  // 1. Validate the Session
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (session.user as any).role !== "CANDIDATE") {
    redirect("/login");
  }

  // 2. Fetch the candidate profile linked to the logged-in user
  const candidate = await prisma.candidate.findUnique({
    where: { userId: (session.user as any).id },
  });

  if (!candidate) {
    // If the candidate hasn't filled out their registration form yet, redirect them
    redirect("/candidate/register");
  }

  // 3. Fetch any secure documents uploaded by the admin for this user
  const documents = await prisma.document.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' }
  });

  // 4. Serialize Dates for the Client Component
  const serializedCandidate = {
    ...candidate,
    dob: candidate.dob.toISOString(),
    createdAt: candidate.createdAt.toISOString(),
    updatedAt: candidate.updatedAt.toISOString(),
  };

  const serializedDocuments = documents.map(d => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <div className="bg-slate-50 min-h-screen">
      <CandidateDashboard 
        candidate={serializedCandidate} 
        documents={serializedDocuments} 
      />
    </div>
  );
}
