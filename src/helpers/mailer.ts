import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function sendEmail({ email, emailType, userId }: any) {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    const path = emailType === "VERIFY" ? "/verifyemail" : "/resetpassword";
    const url = `${process.env.DOMAIN}${path}?token=${hashedToken}`;

    console.log("email:", email);
    console.log("emailType:", emailType);
    console.log("userId:", userId);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 1000 * 60 * 60,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 1000 * 60 * 60,
      });
    }
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: "Umakant@umakant.ai",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
    <p>
      Click <a href="${url}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.
      <br><br>
      If the button doesn't work, copy and paste this link:
      <br>
      ${url}
    </p>
  `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
