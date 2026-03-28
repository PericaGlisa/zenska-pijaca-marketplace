import { Resend } from "resend";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = "contact" | "newsletter" | "order";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  customerMessage?: string;
  items: OrderItem[];
  itemsTotal?: number;
  shippingPrice?: number;
  totalPrice: number;
}

const parseRecipients = (value: string | undefined, fallback: string[]) => {
  if (!value) return fallback;
  const recipients = value
    .split(/[,\s;]+/g)
    .map((v) => v.trim())
    .filter(Boolean);
  return recipients.length > 0 ? recipients : fallback;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const toNumber = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  }).format(amount);

const toPdfSafeText = (value: string) =>
  value
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const padNumber = (value: number) => value.toString().padStart(2, "0");

const createInvoiceNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = padNumber(now.getMonth() + 1);
  const d = padNumber(now.getDate());
  const h = padNumber(now.getHours());
  const min = padNumber(now.getMinutes());
  const random = Math.floor(Math.random() * 900 + 100);
  return `ZP-${y}${m}${d}-${h}${min}-${random}`;
};

const normalizeOrderData = (raw: unknown) => {
  const input = (raw ?? {}) as Partial<OrderData> & { items?: unknown[] };
  const items = (Array.isArray(input.items) ? input.items : []).map((item) => {
    const row = (item ?? {}) as Partial<OrderItem>;
    return {
      name: row.name || "Proizvod",
      quantity: Math.max(1, Math.round(toNumber(row.quantity) || 1)),
      price: Math.max(0, toNumber(row.price)),
    };
  });

  const calculatedItemsTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const itemsTotal =
    typeof input.itemsTotal === "number" ? Math.max(0, input.itemsTotal) : calculatedItemsTotal;
  const shippingPrice = Math.max(0, toNumber(input.shippingPrice));
  const totalPrice =
    typeof input.totalPrice === "number"
      ? Math.max(0, input.totalPrice)
      : Math.max(0, itemsTotal + shippingPrice);

  return {
    customerName: input.customerName || "Nepoznat kupac",
    customerEmail: input.customerEmail || "",
    customerPhone: input.customerPhone || "",
    customerAddress: input.customerAddress || "",
    customerCity: input.customerCity || "",
    customerPostalCode: input.customerPostalCode || "",
    customerMessage: input.customerMessage || "",
    items,
    itemsTotal,
    shippingPrice,
    totalPrice,
  };
};

const createInvoiceHtml = (orderData: ReturnType<typeof normalizeOrderData>, invoiceNumber: string) => {
  const issueDate = new Date().toLocaleString("sr-RS");
  const rows = orderData.items
    .map((item, index) => {
      const lineTotal = item.quantity * item.price;
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.price)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5; max-width: 800px;">
      <h2 style="margin-bottom: 8px;">Nova porudžbina — Faktura</h2>
      <p style="margin: 0 0 16px 0;"><strong>Broj fakture:</strong> ${invoiceNumber}<br /><strong>Datum:</strong> ${issueDate}</p>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0;"><strong>Kupac:</strong> ${escapeHtml(orderData.customerName)}</p>
        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${escapeHtml(orderData.customerEmail)}</p>
        <p style="margin: 0 0 8px 0;"><strong>Telefon:</strong> ${escapeHtml(orderData.customerPhone)}</p>
        <p style="margin: 0 0 8px 0;"><strong>Adresa:</strong> ${escapeHtml(orderData.customerAddress)}, ${escapeHtml(orderData.customerCity)} ${escapeHtml(orderData.customerPostalCode)}</p>
        <p style="margin: 0;"><strong>Poruka kupca:</strong> ${escapeHtml(orderData.customerMessage || "-")}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">#</th>
            <th style="padding: 8px; text-align: left;">Proizvod</th>
            <th style="padding: 8px; text-align: center;">Količina</th>
            <th style="padding: 8px; text-align: right;">Cena</th>
            <th style="padding: 8px; text-align: right;">Ukupno</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin: 4px 0; text-align: right;"><strong>Međuzbir:</strong> ${formatCurrency(orderData.itemsTotal)}</p>
      <p style="margin: 4px 0; text-align: right;"><strong>Dostava:</strong> ${formatCurrency(orderData.shippingPrice)}</p>
      <p style="margin: 8px 0 0 0; font-size: 18px; text-align: right;"><strong>Za naplatu:</strong> ${formatCurrency(orderData.totalPrice)}</p>
    </div>
  `;
};

const createInvoicePdfBase64 = async (
  orderData: ReturnType<typeof normalizeOrderData>,
  invoiceNumber: string,
) => {
  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]);
  const marginLeft = 50;
  const maxWidth = 495;
  let y = 800;

  const drawLine = (
    text: string,
    options: { fontSize?: number; bold?: boolean; color?: ReturnType<typeof rgb>; step?: number } = {},
  ) => {
    if (y < 60) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = 800;
    }
    page.drawText(toPdfSafeText(text), {
      x: marginLeft,
      y,
      size: options.fontSize ?? 11,
      font: options.bold ? boldFont : regularFont,
      color: options.color ?? rgb(0.1, 0.1, 0.1),
      maxWidth,
    });
    y -= options.step ?? 18;
  };

  drawLine("Ženska Pijaca", { fontSize: 18, bold: true, step: 24 });
  drawLine("Faktura porudžbine", { fontSize: 13, bold: true });
  drawLine(`Broj fakture: ${invoiceNumber}`);
  drawLine(`Datum: ${new Date().toLocaleString("sr-RS")}`, { step: 24 });

  drawLine("Podaci kupca", { bold: true });
  drawLine(`Ime: ${orderData.customerName}`);
  drawLine(`Email: ${orderData.customerEmail}`);
  drawLine(`Telefon: ${orderData.customerPhone}`);
  drawLine(`Adresa: ${orderData.customerAddress}, ${orderData.customerCity} ${orderData.customerPostalCode}`);
  drawLine(`Poruka: ${orderData.customerMessage || "-"}`, { step: 24 });

  drawLine("Stavke", { bold: true });
  orderData.items.forEach((item, index) => {
    const lineTotal = item.quantity * item.price;
    drawLine(
      `${index + 1}. ${item.name} | Količina: ${item.quantity} | Cena: ${formatCurrency(item.price)} | Ukupno: ${formatCurrency(lineTotal)}`,
    );
  });

  drawLine("", { step: 10 });
  drawLine(`Međuzbir: ${formatCurrency(orderData.itemsTotal)}`, { bold: true });
  drawLine(`Dostava: ${formatCurrency(orderData.shippingPrice)}`, { bold: true });
  drawLine(`Za naplatu: ${formatCurrency(orderData.totalPrice)}`, {
    fontSize: 13,
    bold: true,
    color: rgb(0.13, 0.35, 0.12),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
};

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const type = body.type as EmailType;
    const data = body.data as Record<string, unknown>;

    let subject = "";
    let html = "";
    let attachments: Array<{ filename: string; content: string }> = [];
    const fallbackRecipients = ["info@zenskapijaca.rs"];
    const to =
      type === "order"
        ? parseRecipients(process.env.ORDER_EMAILS || process.env.CONTACT_EMAIL, fallbackRecipients)
        : parseRecipients(process.env.CONTACT_EMAILS || process.env.CONTACT_EMAIL, fallbackRecipients);

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
      const orderData = normalizeOrderData(data);
      const invoiceNumber = createInvoiceNumber();
      subject = `Nova narudžbina - ${invoiceNumber}`;
      html = createInvoiceHtml(orderData, invoiceNumber);
      attachments = [
        {
          filename: `faktura-${invoiceNumber}.pdf`,
          content: await createInvoicePdfBase64(orderData, invoiceNumber),
        },
      ];
    } else {
      return new Response("Invalid email type", { status: 400 });
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Ženska Pijaca <info@zenskapijaca.rs>",
      to,
      subject,
      html,
      attachments,
      reply_to: data.email || data.customerEmail,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // --- Send Confirmation Email to Customer (if it's an order) ---
    if (type === "order" && data.customerEmail) {
      try {
        const orderData = normalizeOrderData(data);
        const customerSubject = "Potvrda narudžbine - Ženska Pijaca";
        const customerItemsTotalLine = `<p><strong>Međuzbir:</strong> ${formatCurrency(orderData.itemsTotal)}</p>`;
        const customerShippingLine = `<p><strong>Dostava:</strong> ${formatCurrency(orderData.shippingPrice)}</p>`;
        const customerHtml = `
          <h3>Hvala na narudžbini, ${escapeHtml(orderData.customerName)}!</h3>
          <p>Uspešno smo primili vašu narudžbinu. Uskoro ćemo vas kontaktirati radi potvrde i slanja.</p>
          <p><strong>Adresa za dostavu:</strong> ${escapeHtml(orderData.customerAddress)}, ${escapeHtml(orderData.customerCity)} ${escapeHtml(orderData.customerPostalCode)}</p>
          <h4>Vaša narudžbina:</h4>
          <ul>
            ${orderData.items.map((item) => `<li>${escapeHtml(item.name)} x ${item.quantity} - ${formatCurrency(item.price)}</li>`).join("")}
          </ul>
          ${customerItemsTotalLine}
          ${customerShippingLine}
          <p><strong>Ukupno za naplatu:</strong> ${formatCurrency(orderData.totalPrice)}</p>
          <hr>
          <p><small>Ovo je automatska poruka. Molimo vas da ne odgovarate na nju.</small></p>
        `;

        await resend.emails.send({
          from: "Ženska Pijaca <info@zenskapijaca.rs>",
          to: [data.customerEmail],
          subject: customerSubject,
          html: customerHtml,
        });
        console.log("Confirmation email sent to:", data.customerEmail);
      } catch (custError) {
        // We do NOT want to fail the request if the customer email fails 
        // (common in Resend Sandbox if sending to unverified emails)
        console.warn("Failed to send confirmation email (likely Resend Sandbox limitation):", custError);
      }
    }
    // ---------------------------------------------------------------

    return new Response(JSON.stringify(emailData), { status: 200 });
  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
};
