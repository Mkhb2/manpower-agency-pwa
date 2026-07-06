import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCVStream } from "@/lib/cv-generator";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");

    if (!candidateId) {
      return new NextResponse("Missing candidateId", { status: 400 });
    }

    // Fetch Candidate Data
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      return new NextResponse("Candidate not found", { status: 404 });
    }

    // Format data for the CV Generator
    const cvData = {
      firstName: candidate.firstName,
      surname: candidate.surname,
      fatherName: candidate.fatherName,
      motherName: candidate.motherName,
      dob: candidate.dob.toISOString().split('T')[0],
      address: candidate.address,
      passportNo: candidate.passportNo,
      mobile: candidate.user?.mobile || "", // Need to fetch via relation if not in candidate model, but based on our schema user relation has mobile. Wait, mobile is in User. We should include user in Prisma query.
      email: candidate.user?.email || "",
      jobAppliedFor: candidate.jobAppliedFor,
      countryAppliedFor: candidate.countryAppliedFor,
      photoUrl: candidate.photoUrl
    };

    // Correcting the query to include user relation
    const candidateWithUser = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { user: true }
    });
    
    if (candidateWithUser) {
        cvData.mobile = candidateWithUser.user.mobile || "";
        cvData.email = candidateWithUser.user.email || "";
    }

    // Generate the PDF Stream
    const pdfStream = await generateCVStream(cvData);

    // Return as downloadable PDF
    return new NextResponse(pdfStream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${candidate.firstName}_${candidate.surname}_CV.pdf"`,
      },
    });

  } catch (error) {
    console.error("CV Generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
