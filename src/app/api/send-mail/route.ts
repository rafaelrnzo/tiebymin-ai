import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { to, subject, html, attachments } = await request.json();

  // Brevo API key
  const API_KEY = "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";
  
  console.log("Brevo API Configuration:", {
    apiKey: API_KEY ? "*****" + API_KEY.substring(API_KEY.length - 5) : "Not configured"
  });

  try {
    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { error: "Recipient email address is required" },
        { status: 400 }
      );
    }
    
    if (!subject) {
      return NextResponse.json(
        { error: "Email subject is required" },
        { status: 400 }
      );
    }
    
    if (!html) {
      return NextResponse.json(
        { error: "Email content (html) is required" },
        { status: 400 }
      );
    }
    
    // Prepare email data for Brevo API
    const emailData: {
      sender: { name: string; email: string };
      to: { email: string; name: string }[];
      subject: string;
      htmlContent: string;
      attachment?: { name: string; content: string; contentType: string }[];
    } = {
      sender: {
        name: "Tiebymin AI",
        email: "dudungarizky@gmail.com"
      },
      to: [{
        email: to,
        name: to.split('@')[0] // Use part before @ as name if no name provided
      }],
      subject: subject,
      htmlContent: html
    };
    
    // Add attachments if present
    if (attachments && Array.isArray(attachments)) {
      console.log(`Processing ${attachments.length} attachments`);
      
      // Convert attachments to Brevo format
      const brevoAttachments = attachments.map(attachment => {
        // Validate attachment
        if (!attachment.content) {
          console.warn(`Attachment is missing content`);
        }
        if (!attachment.filename) {
          console.warn(`Attachment is missing filename`);
        }
        
        return {
          name: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType || 'application/octet-stream'
        };
      });
      
      // Add attachments to email data
      emailData.attachment = brevoAttachments;
      console.log(`Email has ${brevoAttachments.length} attachments`);
    }

    console.log(`Sending email to ${to} with subject: ${subject}`);
    
    // Send email using Brevo API
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'accept': 'application/json',
          'api-key': API_KEY,
          'content-type': 'application/json'
        }
      }
    );
    
    console.log("Email sent successfully:", response.data);
    return NextResponse.json({ message: "Email sent successfully", info: response.data });
  } catch (error: any) {
    console.error("Error sending email:", error);
    
    // Provide more detailed error information
    const errorMessage = error.response?.data?.message || error.message || "Unknown error";
    const errorCode = error.response?.status || "UNKNOWN";
    
    return NextResponse.json(
      { 
        error: "Failed to send email", 
        details: errorMessage,
        code: errorCode 
      },
      { status: 500 }
    );
  }
}
