import { Context } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { type, data } = body;

    let subject = "";
    let html = "";
    // Using a default recipient for now - ideally this comes from env or config
    const to = "info@zenskapijaca.rs"; 

    if (type === "contact") {
      subject = `Nova poruka: ${data.subject}`;
      html = `
        <h3>Nova poruka sa sajta</h3>
        <p><strong>Ime:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Poruka:</strong></p>
        <p>${data.message}</p>
      `;
    } else if (type === "newsletter") {
      subject = "Nova prijava za newsletter";
      html = `<p>Korisnik <strong>${data.email}</strong> se prijavio za newsletter.</p>`;
    } else if (type === "order") {
      subject = "Nova narudžbina!";
      html = `
        <h3>Detalji narudžbine</h3>
        <p><strong>Kupac:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Telefon:</strong> ${data.customerPhone}</p>
        <p><strong>Poruka:</strong> ${data.customerMessage}</p>
        <h4>Stavke:</h4>
        <ul>
          ${data.items.map((item: any) => `<li>${item.name} x ${item.quantity} - ${item.price} RSD</li>`).join("")}
        </ul>
        <p><strong>Ukupno:</strong> ${data.totalPrice} RSD</p>
      `;
    } else {
      return new Response("Invalid email type", { status: 400 });
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Ženska Pijaca <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      reply_to: data.email || data.customerEmail,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(emailData), { status: 200 });
  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
};
