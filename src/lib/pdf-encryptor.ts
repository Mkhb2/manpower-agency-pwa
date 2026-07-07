import { PDFDocument } from 'pdf-lib-plus-encrypt';

/**
 * Generates the password based on candidate's first name and DOB.
 * Requirement: first 4 letters of first name (lowercase) + DOB (YYYY)
 * Example: ahme1990
 */
export const generatePassword = (firstName: string, dobString: string): string => {
  const namePart = firstName.toLowerCase().slice(0, 4);
  const dobDate = new Date(dobString);
  const yearPart = dobDate.getFullYear().toString();
  
  // If the first name is shorter than 4 letters, pad it or just use what's available
  // E.g. Ali -> ali1990
  return `${namePart}${yearPart}`;
};

/**
 * Encrypts a PDF buffer using pdf-lib.
 * Note: pdf-lib encryption requires @pdf-lib/upng if images are used, 
 * but for basic text/encryption standard pdf-lib works well.
 * 
 * @param pdfBuffer - The original PDF file as a Uint8Array (or Buffer)
 * @param password - The generated password
 * @returns Encrypted PDF as a Uint8Array
 */
export const encryptPdf = async (pdfBuffer: Uint8Array, password: string): Promise<Uint8Array> => {
  // Load the existing PDF
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Set the encryption options
  pdfDoc.encrypt({
    userPassword: password,
    ownerPassword: password + '-admin-master', // A strong owner password
    permissions: { printing: 'highResolution', modifying: false, copying: false },
  });

  // Save the encrypted PDF
  const encryptedPdfBytes = await pdfDoc.save();
  return encryptedPdfBytes;
};

/*
  Example Usage in a Next.js API Route:

  import { generatePassword, encryptPdf } from '@/lib/pdf-encryptor';

  export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const candidateFirstName = formData.get('firstName') as string;
    const candidateDob = formData.get('dob') as string;

    const buffer = new Uint8Array(await file.arrayBuffer());
    const password = generatePassword(candidateFirstName, candidateDob);
    
    const encryptedBytes = await encryptPdf(buffer, password);
    
    // Save `encryptedBytes` to S3 / Blob Storage
    // Update Document database record
    
    return Response.json({ success: true, message: "PDF Encrypted and Uploaded" });
  }
*/
