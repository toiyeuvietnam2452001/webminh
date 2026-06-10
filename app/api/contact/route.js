import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        const { name, phone, message } = await request.json();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: `[Lead moi] ${name} - ${phone}`,
            html: `
                <h2>Khach hang moi tu minhnguyenmkt.vercel.app</h2>
                <p><strong>Ho ten:</strong> ${name}</p>
                <p><strong>SDT:</strong> ${phone}</p>
                <p><strong>Noi dung:</strong> ${message || "Khong co"}</p>
            `,
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false }, { status: 500 });
    }
}
