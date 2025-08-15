import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "94d25a003@smtp-brevo.com",
      pass: process.env.SMTP_PASS || "tFsmTdN0EPLKkaMV",
    },
  });

  try {
    const mailOptions = {
      from: "muhammadrayaarrizki@gmail.com",
      to: to,
      subject: subject,
      html: html,
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
