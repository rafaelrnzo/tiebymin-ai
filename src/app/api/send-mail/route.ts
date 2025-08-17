import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const formData = await request.formData();
  const to = formData.get("to") as string;
  const subject = formData.get("subject") as string;
  const html = formData.get("html") as string;
  const pdfFile = formData.get("pdf") as File;
  const pngFile = formData.get("png") as File;

  if (!to || !subject || !html || !pdfFile || !pngFile) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "94d25a003@smtp-brevo.com",
      pass: "tFsmTdN0EPLKkaMV",
    },
     connectionTimeout: 60000,
      greetingTimeout: 60000,
      socketTimeout: 60000,
      ignoreTLS: false,
      requireTLS: true,
  });

  try {
    const mailOptions = {
      from: "muhammadrayaarrizki@gmail.com",
      to: to,
      subject: subject,
      html: html,
      secure:false,
      attachments: [
        {
          filename: "analysis-result.pdf",
          content: Buffer.from(await pdfFile.arrayBuffer()),
          contentType: "application/pdf",
        },
        {
          filename: "story-result.png",
          content: Buffer.from(await pngFile.arrayBuffer()),
          contentType: "image/png",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}