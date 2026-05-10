import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInviteEmail = async (email: string, inviteLink: string) => {
  console.log(inviteLink);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Invitation to start your academic excellence",
    html: `
      <h2>You were invited</h2>
      <p>Click below to create your account:</p>
      <a href="${inviteLink}">
        Accept Invitation
      </a>
    `,
  });
};
