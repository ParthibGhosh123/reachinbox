import nodemailer from 'nodemailer';

const senders = [
  { user: process.env.ETHEREAL_USER!, pass: process.env.ETHEREAL_PASS! },
  { user: process.env.ETHEREAL_USER_2!, pass: process.env.ETHEREAL_PASS_2! },
].filter(s => s.user);

let idx = 0;
export async function sendEmail(to: string, subject: string, body: string) {
  const sender = senders[idx % senders.length];
  idx++;
  const transporter = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, secure: false, auth: sender });
  const info = await transporter.sendMail({ from: '"ReachInbox" <hello@reachinbox.com>', to, subject, text: body, html: `<p>${body}</p>` });
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log(`Sent to ${to} | Preview: ${previewUrl}`);
  return { previewUrl };
}