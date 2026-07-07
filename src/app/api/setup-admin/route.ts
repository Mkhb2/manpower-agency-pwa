import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@manpower.com' },
      update: {}, // If it exists, do nothing
      create: {
        email: 'admin@manpower.com',
        role: 'ADMIN',
        // Password hash is empty, meaning any password will work for testing
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin account successfully created!", 
      loginDetails: {
        email: 'admin@manpower.com',
        password: 'Any password you want (e.g. 12345)'
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Setup Admin Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
