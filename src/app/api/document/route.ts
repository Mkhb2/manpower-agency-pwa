import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // 1. Authenticate Request
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // 2. Parse the Document ID from the query string
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Missing document ID." }, { status: 400 });
    }

    // 3. Fetch the document metadata from Prisma
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found in database." }, { status: 404 });
    }

    // 4. Secure Authorization Check
    // Ensure the person trying to download this is either the owner or an Admin
    const isOwner = document.userId === (session.user as any).id;
    const isAdmin = (session.user as any).role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden. You do not have permission to view this document." }, { status: 403 });
    }

    // 5. Redirect the user securely to the unguessable Blob link
    // The PDF is encrypted with their password, so even if the link leaks, it's secure.
    return NextResponse.redirect(document.url);

  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
