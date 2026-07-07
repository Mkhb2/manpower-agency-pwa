import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { PDFDocument } from "pdf-lib-plus-encrypt";
import { put } from '@vercel/blob';
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Authenticate and Authorize
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only admins can upload documents." }, { status: 403 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const candidateId = formData.get("candidateId") as string;
    const documentName = formData.get("documentName") as string;

    if (!file || !candidateId || !documentName) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    // 3. Enforce 5MB Limit
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB limit." }, { status: 400 });
    }

    // 4. Fetch Candidate
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { user: true }
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    // 5. Generate Password & Encrypt
    const namePart = candidate.firstName.slice(0, 4).toLowerCase();
    const dobYear = new Date(candidate.dob).getFullYear();
    const password = `${namePart}${dobYear}`;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: process.env.NEXTAUTH_SECRET || "admin-fallback-pass",
      permissions: { printing: 'highResolution', modifying: false, copying: false },
    });

    const encryptedPdfBytes = await pdfDoc.save();

    // 6. Upload to Vercel Blob
    const fileName = `${candidate.id}-${Date.now()}.pdf`;
    const blob = await put(fileName, encryptedPdfBytes, {
      access: 'public',
      contentType: 'application/pdf',
    });

    // 7. Save metadata in Prisma (saving the Blob URL)
    const newDocument = await prisma.document.create({
      data: {
        name: documentName,
        url: blob.url,
        isEncrypted: true,
        userId: candidate.userId, 
      }
    });

    return NextResponse.json(
      { message: "Document securely encrypted and uploaded to Cloud.", document: newDocument },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
