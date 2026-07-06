"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function submitCandidateRegistration(formData: FormData) {
  // In a real app, we would get the user ID from the active session
  // const session = await getSession();
  // const userId = session.user.id;
  
  // For demonstration, we create a mock user or assume one exists
  const mockUserId = `mock-user-${Date.now()}`;
  
  await prisma.user.create({
    data: {
      id: mockUserId,
      role: "CANDIDATE",
      email: formData.get("email") as string,
      mobile: formData.get("mobile") as string,
      candidateInfo: {
        create: {
          firstName: formData.get("firstName") as string,
          surname: formData.get("surname") as string,
          fatherName: formData.get("fatherName") as string,
          motherName: formData.get("motherName") as string,
          dob: new Date(formData.get("dob") as string),
          address: formData.get("address") as string,
          passportNo: formData.get("passportNo") as string,
          jobAppliedFor: formData.get("jobAppliedFor") as string,
          countryAppliedFor: formData.get("countryAppliedFor") as string,
          photoUrl: formData.get("photoUrl") as string || "", // Assuming photo was uploaded to cloud and URL is passed
        }
      }
    }
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function updateCandidateStatus(candidateId: string, status: "FIT_FOR_APPLY_PENDING" | "SUCCESSFULLY_APPLIED" | "APPROVED" | "REJECTED") {
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { status }
  });
  
  revalidatePath("/admin");
  revalidatePath("/candidate");
  return { success: true };
}
