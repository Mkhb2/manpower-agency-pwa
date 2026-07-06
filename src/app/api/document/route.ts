import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export async function GET(req: Request) {
  try {
    // 1. Authenticate Request
    const session = await getServerSession();
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

    // 5. Generate a Signed URL valid for 60 seconds from the private bucket
    const { data, error } = await supabase.storage
      .from("manpower-documents")
      .createSignedUrl(document.url, 60);

    if (error || !data) {
      console.error("Supabase Signed URL Error:", error);
      return NextResponse.json({ error: "Failed to securely retrieve document from Cloud Storage." }, { status: 500 });
    }

    // 6. Redirect the user securely to the temporary download link
    return NextResponse.redirect(data.signedUrl);

  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
