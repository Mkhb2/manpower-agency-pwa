// This is a utility service for handling outgoing emails and SMS notifications.
// For production, you would install and use a library like 'resend' or 'nodemailer'.

type NotificationOptions = {
  to: string; // Email or Mobile Number
  subject: string;
  message: string;
  type: "EMAIL" | "SMS";
};

/**
 * Main dispatch function for notifications.
 */
export async function sendNotification(options: NotificationOptions) {
  if (options.type === "EMAIL") {
    return await sendEmail(options.to, options.subject, options.message);
  } else {
    return await sendSMS(options.to, options.message);
  }
}

/**
 * Helper to send an Email. 
 * Placeholder logic for Resend or Nodemailer.
 */
async function sendEmail(email: string, subject: string, htmlMessage: string) {
  console.log(`[MOCK EMAIL SENT to ${email}]`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${htmlMessage}`);
  
  /* Example Resend implementation:
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'onboarding@youragency.com',
    to: email,
    subject: subject,
    html: htmlMessage
  });
  */
  
  return { success: true };
}

/**
 * Helper to send an SMS.
 * Placeholder logic for Twilio or similar SMS gateway.
 */
async function sendSMS(mobileNumber: string, message: string) {
  console.log(`[MOCK SMS SENT to ${mobileNumber}]`);
  console.log(`Message: ${message}`);
  
  /* Example Twilio implementation:
  import twilio from 'twilio';
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  
  await client.messages.create({
    body: message,
    from: '+12345678901', // Your Twilio number
    to: mobileNumber
  });
  */
  
  return { success: true };
}

/**
 * Pre-defined notification templates to ensure consistency.
 */
export const NotificationTemplates = {
  fitForApply: (candidateName: string) => ({
    subject: "Action Required: You are Fit for Apply!",
    message: `<p>Hello ${candidateName},</p>
              <p>Great news! The administration has reviewed your profile and determined you are a strong candidate.</p>
              <p>Please log in to your portal immediately to confirm and proceed with the job application process.</p>`
  }),
  
  interviewScheduled: (candidateName: string, company: string, date: string, link: string) => ({
    subject: `Interview Scheduled with ${company}`,
    message: `<p>Hello ${candidateName},</p>
              <p>You have an upcoming interview with <strong>${company}</strong>.</p>
              <p><strong>Date & Time:</strong> ${new Date(date).toLocaleString()}</p>
              <p><strong>Location/Link:</strong> <a href="${link}">${link}</a></p>
              <p>Please prepare accordingly and log in to your dashboard for more details.</p>`
  }),

  documentUploaded: (candidateName: string, documentName: string) => ({
    subject: `New Secure Document: ${documentName}`,
    message: `<p>Hello ${candidateName},</p>
              <p>A new secure document (<strong>${documentName}</strong>) has been uploaded to your dashboard.</p>
              <p>Log in to download it. Remember, your password is the first 4 letters of your first name + your birth year.</p>`
  })
};
