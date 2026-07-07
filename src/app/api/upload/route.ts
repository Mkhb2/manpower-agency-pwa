export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generatePassword, encryptPdf } from "@/lib/pdf-encryptor";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const candidateId = formData.get("candidateId") as string;
    const documentName = formData.get("documentName") as string;

    if (!file || !candidateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch Candidate to get First Name and DOB for password generation
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Process PDF Encryption
    const buffer = new Uint8Array(await file.arrayBuffer());
    const password = generatePassword(candidate.firstName, candidate.dob.toISOString());
    const encryptedBytes = await encryptPdf(buffer, password);

    // In a production environment, you would upload `encryptedBytes` to AWS S3, Vercel Blob, etc.
    // For this example, we'll pretend it's uploaded and we got a URL back.
    const mockCloudUrl = `https://storage.example.com/docs/${candidateId}-${Date.now()}.pdf`;

    // Save Document record in DB
    const newDoc = await prisma.document.create({
      data: {
        userId: candidate.userId,
        name: documentName || "Offer Letter",
        url: mockCloudUrl,
        isEncrypted: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Document encrypted and uploaded successfully.",
      document: newDoc 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
