import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request) {
    try {
        const { name, email, phone, message, subject: clientSubject } = await request.json() // Destructure phone and clientSubject

        // Basic Validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: "Name, email, and message fields are required." }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format." }, { status: 400 })
        }

        // Use a default subject if not provided by the client
        const subject = clientSubject || "Website Contact Form Submission"

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number.parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports like 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        await transporter.verify()

        // Admin Email (to you)
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            to: process.env.NEXT_PUBLIC_WEBSITE_EMAIL,
            subject: `Contact Form: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #007bff;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #888;">
            <p>This email was sent from your website's contact form.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
            text: `
        New Contact Form Submission
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ""}
        Subject: ${subject}
        Message:
        ${message}
        Timestamp: ${new Date().toLocaleString()}
      `,
        }

        // Auto-reply to sender
        const autoReplyOptions = {
            from: `"${process.env.NEXT_PUBLIC_WEBSITE_NAME}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Thank you for contacting us, ${name}!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Thank You for Your Message!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us. We have received your message and will respond shortly.</p>
          <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <h4>Your Message:</h4>
            <p><strong>Subject:</strong> ${subject}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br>${process.env.NEXT_PUBLIC_WEBSITE_TEAM_NAME}</p>
          <p style="font-size: 12px; color: #777;">This is an automated response. Please do not reply.</p>
        </div>
      `,
            text: `
        Dear ${name},
        Thank you for contacting us. We have received your message:
        Subject: ${subject}
        ${phone ? `Phone: ${phone}` : ""}
        Message: ${message}
        We'll respond as soon as possible.
        Best regards,
        ${process.env.NEXT_PUBLIC_WEBSITE_TEAM_NAME}
        (This is an automated email. Please do not reply.)
      `,
        }

        // Send both emails
        await Promise.all([transporter.sendMail(mailOptions), transporter.sendMail(autoReplyOptions)])

        return NextResponse.json({ message: "Your message has been sent successfully!", success: true }, { status: 200 })
    } catch (error) {
        console.error("Error sending email:", error)
        return NextResponse.json(
            {
                error: "Failed to send message. Please try again later.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined,
            },
            { status: 500 },
        )
    }
}
