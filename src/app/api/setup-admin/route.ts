import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {
        passwordHash: hashedPassword
      },
      create: {
        email: 'admin@admin.com',
        role: 'ADMIN',
        passwordHash: hashedPassword
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin account successfully created with secure password!", 
      loginDetails: {
        email: 'admin@admin.com',
        password: 'admin123'
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Setup Admin Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
