import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const mobile = formData.get("mobile") as string;
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { mobile }] }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email or Mobile already registered" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Handle photo upload
    const photo = formData.get("photo") as File;
    let photoUrl = "";
    
    if (photo && photo.size > 0) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const fileName = `photos/${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const blob = await put(fileName, buffer, { access: 'public' });
      photoUrl = blob.url;
    }

    // Create User and Candidate
    const newUser = await prisma.user.create({
      data: {
        email,
        mobile,
        passwordHash,
        role: "CANDIDATE",
        candidateInfo: {
          create: {
            firstName: formData.get("firstName") as string,
            surname: formData.get("surname") as string,
            fatherName: formData.get("fatherName") as string,
            motherName: formData.get("motherName") as string,
            dob: new Date(formData.get("dob") as string),
            passportNo: formData.get("passportNo") as string,
            address: formData.get("address") as string,
            jobAppliedFor: formData.get("jobAppliedFor") as string,
            countryAppliedFor: formData.get("countryAppliedFor") as string,
            photoUrl: photoUrl || `https://ui-avatars.com/api/?name=${formData.get("firstName")}`,
          }
        }
      }
    });

    return NextResponse.json({ success: true, user: { id: newUser.id } }, { status: 201 });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
