export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the user session
    const session = await getServerSession();
    
    // 2. Authorize the user (Only Admin can change statuses)
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can perform this action." },
        { status: 403 }
      );
    }

    // 3. Parse the request body
    const body = await req.json();
    const { candidateId, status } = body;

    if (!candidateId || !status) {
      return NextResponse.json(
        { error: "Missing candidateId or status in request body." },
        { status: 400 }
      );
    }

    // 4. Update the candidate in the database
    const updatedCandidate = await prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        status: status, // e.g. "FIT_FOR_APPLY_PENDING"
      },
    });

    // 5. Optionally, trigger Notification Service here
    // import { sendNotification, NotificationTemplates } from "@/lib/notification-service";
    // await sendNotification({
    //   to: updatedCandidate.user.email,
    //   ...NotificationTemplates.fitForApply(updatedCandidate.firstName)
    // });

    return NextResponse.json(
      { 
        message: "Candidate status updated successfully.",
        candidate: updatedCandidate 
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error("Error updating candidate status:", error);
    
    // Handle Prisma specific errors (e.g., RecordNotFound)
    if (error.code === 'P2025') {
       return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
