import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const ROLE_META: Record<string, { label: string; color: string; desc: string }> = {
  student: {
    label: "Student",
    color: "#4f46e5",
    desc: "You've been invited to join the Smart Campus student portal. Track your courses, grades, attendance, and payments all in one place.",
  },
  instructor: {
    label: "Instructor",
    color: "#7c3aed",
    desc: "You've been invited to join the Smart Campus faculty portal. Manage your courses, upload lectures, record grades, and track student attendance.",
  },
  admin: {
    label: "Administrator",
    color: "#dc2626",
    desc: "You've been invited to join Smart Campus as an administrator. Manage users, courses, departments, and monitor platform activity.",
  },
};

export const sendInviteEmail = async (
  email: string,
  inviteLink: string,
  role: string
) => {
  const meta = ROLE_META[role] ?? ROLE_META.student;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Smart Campus Invitation</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header band -->
          <tr>
            <td style="background:${meta.color};padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Smart Campus</p>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:1px;text-transform:uppercase;">${meta.label} Portal Invitation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">You're invited!</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#4b5563;">${meta.desc}</p>

              <table cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;width:100%;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#9ca3af;">Invited email</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 16px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#9ca3af;">Account type</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:${meta.color};">${meta.label}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" style="display:inline-block;padding:14px 36px;background:${meta.color};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;letter-spacing:-0.1px;">
                      Accept Invitation &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Or copy this link into your browser:</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;word-break:break-all;background:#f3f4f6;padding:10px 14px;border-radius:8px;">${inviteLink}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                This invitation expires in 48 hours. If you didn't expect this email, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await transporter.sendMail({
    from: `"Smart Campus" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `You're invited to Smart Campus — ${meta.label} Portal`,
    html,
  });
};
