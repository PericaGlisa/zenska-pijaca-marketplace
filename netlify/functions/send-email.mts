import { Resend } from "resend";
import { getStore } from "@netlify/blobs";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";

const resend = new Resend(process.env.RESEND_API_KEY);
const invoiceStore = getStore({ name: "invoice-sequence-store" });
const assetCache = new Map<string, Uint8Array>();

const BRAND = {
  primary: rgb(0.50, 0.64, 0.29),
  primaryDark: rgb(0.12, 0.17, 0.11),
  accent: rgb(0.94, 0.89, 0.78),
  text: rgb(0.13, 0.13, 0.13),
  mutedText: rgb(0.38, 0.38, 0.38),
  border: rgb(0.89, 0.89, 0.89),
};

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

const fetchAsset = async (url: string) => {
  if (assetCache.has(url)) return assetCache.get(url)!;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch asset: ${url}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  assetCache.set(url, bytes);
  return bytes;
};

const getInvoiceNumber = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = process.env.INVOICE_PREFIX || "ZP";
  const key = `invoice-seq-${year}`;
  try {
    const existing = await invoiceStore.get(key, { type: "text" });
    const current = Number(existing || "0");
    const next = Number.isFinite(current) ? current + 1 : 1;
    await invoiceStore.set(key, String(next));
    return `${prefix}-${year}-${String(next).padStart(6, "0")}`;
  } catch {
    const fallback = `${now.getMonth() + 1}${padNumber(now.getDate())}${padNumber(now.getHours())}${padNumber(now.getMinutes())}${padNumber(now.getSeconds())}`;
    return `${prefix}-${year}-${fallback}`;
  }
};

const padNumber = (value: number) => value.toString().padStart(2, "0");

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
  pdfDoc.registerFontkit(fontkit);

  const regularFontBytes = await fetchAsset(
    "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf",
  );
  const boldFontBytes = await fetchAsset(
    "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf",
  );
  const regularFont = await pdfDoc.embedFont(regularFontBytes, { subset: true });
  const boldFont = await pdfDoc.embedFont(boldFontBytes, { subset: true });

  let page = pdfDoc.addPage([595.28, 841.89]);
  const marginLeft = 50;
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const maxWidth = 495.28;
  let y = 700;

  page.drawRectangle({
    x: 0,
    y: pageHeight - 120,
    width: pageWidth,
    height: 120,
    color: BRAND.primaryDark,
  });
  page.drawRectangle({
    x: 0,
    y: pageHeight - 130,
    width: pageWidth,
    height: 10,
    color: BRAND.primary,
  });

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "https://zenskapijaca.rs";
  const logoUrl = process.env.INVOICE_LOGO_URL || `${siteUrl.replace(/\/$/, "")}/invoice-logo.png`;
  try {
    const logoBytes = await fetchAsset(logoUrl);
    const isPng = logoUrl.toLowerCase().endsWith(".png");
    const logo = isPng ? await pdfDoc.embedPng(logoBytes) : await pdfDoc.embedJpg(logoBytes);
    const scaled = logo.scale(42 / logo.height);
    page.drawImage(logo, {
      x: marginLeft,
      y: pageHeight - 90,
      width: scaled.width,
      height: 42,
    });
  } catch {}

  page.drawText("Ženska Pijaca", {
    x: marginLeft + 58,
    y: pageHeight - 62,
    font: boldFont,
    size: 20,
    color: rgb(1, 1, 1),
  });
  page.drawText("Memorandumska faktura porudžbine", {
    x: marginLeft + 58,
    y: pageHeight - 82,
    font: regularFont,
    size: 10.5,
    color: rgb(0.92, 0.94, 0.92),
  });

  page.drawText("Ženska Pijaca Marketplace", {
    x: 360,
    y: pageHeight - 56,
    font: boldFont,
    size: 11,
    color: rgb(1, 1, 1),
  });
  page.drawText("info@zenskapijaca.rs", {
    x: 360,
    y: pageHeight - 72,
    font: regularFont,
    size: 10,
    color: rgb(0.90, 0.93, 0.90),
  });
  page.drawText("+381621029770", {
    x: 360,
    y: pageHeight - 86,
    font: regularFont,
    size: 10,
    color: rgb(0.90, 0.93, 0.90),
  });

  page.drawRectangle({
    x: marginLeft,
    y: y - 50,
    width: 240,
    height: 78,
    borderColor: BRAND.border,
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });
  page.drawRectangle({
    x: marginLeft,
    y: y + 8,
    width: 240,
    height: 20,
    color: BRAND.accent,
  });
  page.drawText("PODACI KUPCA", {
    x: marginLeft + 10,
    y: y + 14,
    font: boldFont,
    size: 9,
    color: BRAND.primaryDark,
  });

  page.drawText(orderData.customerName, {
    x: marginLeft + 10,
    y: y - 8,
    font: boldFont,
    size: 11,
    color: BRAND.text,
  });
  page.drawText(orderData.customerEmail || "-", {
    x: marginLeft + 10,
    y: y - 24,
    font: regularFont,
    size: 9.5,
    color: BRAND.mutedText,
  });
  page.drawText(orderData.customerPhone || "-", {
    x: marginLeft + 10,
    y: y - 38,
    font: regularFont,
    size: 9.5,
    color: BRAND.mutedText,
  });

  page.drawRectangle({
    x: 320,
    y: y - 50,
    width: 225,
    height: 78,
    borderColor: BRAND.border,
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });
  page.drawText("Broj fakture", {
    x: 332,
    y: y + 6,
    font: regularFont,
    size: 9,
    color: BRAND.mutedText,
  });
  page.drawText(invoiceNumber, {
    x: 332,
    y: y - 10,
    font: boldFont,
    size: 13,
    color: BRAND.primaryDark,
  });
  page.drawText("Datum izdavanja", {
    x: 332,
    y: y - 28,
    font: regularFont,
    size: 9,
    color: BRAND.mutedText,
  });
  page.drawText(new Date().toLocaleString("sr-RS"), {
    x: 332,
    y: y - 42,
    font: boldFont,
    size: 10,
    color: BRAND.text,
  });

  y -= 92;
  page.drawText(`Adresa dostave: ${orderData.customerAddress}, ${orderData.customerCity} ${orderData.customerPostalCode}`, {
    x: marginLeft,
    y,
    font: regularFont,
    size: 10,
    color: BRAND.text,
    maxWidth,
  });
  y -= 16;
  page.drawText(`Napomena kupca: ${orderData.customerMessage || "-"}`, {
    x: marginLeft,
    y,
    font: regularFont,
    size: 10,
    color: BRAND.text,
    maxWidth,
  });
  y -= 24;

  page.drawRectangle({
    x: marginLeft,
    y: y - 22,
    width: maxWidth,
    height: 24,
    color: BRAND.primary,
  });
  page.drawText("RB", { x: marginLeft + 10, y: y - 14, font: boldFont, size: 9.5, color: rgb(1, 1, 1) });
  page.drawText("Proizvod", { x: marginLeft + 38, y: y - 14, font: boldFont, size: 9.5, color: rgb(1, 1, 1) });
  page.drawText("Kol.", { x: marginLeft + 290, y: y - 14, font: boldFont, size: 9.5, color: rgb(1, 1, 1) });
  page.drawText("Cena", { x: marginLeft + 350, y: y - 14, font: boldFont, size: 9.5, color: rgb(1, 1, 1) });
  page.drawText("Iznos", { x: marginLeft + 430, y: y - 14, font: boldFont, size: 9.5, color: rgb(1, 1, 1) });
  y -= 28;

  orderData.items.forEach((item, index) => {
    const rowHeight = 22;
    const lineTotal = item.quantity * item.price;
    const rowColor = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.98, 0.98, 0.98);
    page.drawRectangle({
      x: marginLeft,
      y: y - rowHeight + 4,
      width: maxWidth,
      height: rowHeight,
      color: rowColor,
      borderColor: BRAND.border,
      borderWidth: 0.4,
    });
    page.drawText(String(index + 1), { x: marginLeft + 12, y: y - 10, font: regularFont, size: 9.5, color: BRAND.text });
    page.drawText(item.name, { x: marginLeft + 38, y: y - 10, font: regularFont, size: 9.5, color: BRAND.text, maxWidth: 240 });
    page.drawText(String(item.quantity), { x: marginLeft + 298, y: y - 10, font: regularFont, size: 9.5, color: BRAND.text });
    page.drawText(formatCurrency(item.price), { x: marginLeft + 350, y: y - 10, font: regularFont, size: 9.5, color: BRAND.text });
    page.drawText(formatCurrency(lineTotal), { x: marginLeft + 430, y: y - 10, font: boldFont, size: 9.5, color: BRAND.primaryDark });
    y -= rowHeight;
  });

  y -= 10;
  page.drawRectangle({
    x: 328,
    y: y - 62,
    width: 217,
    height: 72,
    color: rgb(0.99, 0.99, 0.99),
    borderColor: BRAND.border,
    borderWidth: 1,
  });
  page.drawText("Međuzbir", { x: 340, y: y - 8, font: regularFont, size: 10, color: BRAND.mutedText });
  page.drawText(formatCurrency(orderData.itemsTotal), { x: 456, y: y - 8, font: boldFont, size: 10, color: BRAND.text });
  page.drawText("Dostava", { x: 340, y: y - 26, font: regularFont, size: 10, color: BRAND.mutedText });
  page.drawText(formatCurrency(orderData.shippingPrice), { x: 456, y: y - 26, font: boldFont, size: 10, color: BRAND.text });
  page.drawText("Ukupno za naplatu", { x: 340, y: y - 46, font: boldFont, size: 11, color: BRAND.primaryDark });
  page.drawText(formatCurrency(orderData.totalPrice), { x: 456, y: y - 46, font: boldFont, size: 11, color: BRAND.primaryDark });

  page.drawText("Hvala Vam što podržavate lokalne proizvođačice.", {
    x: marginLeft,
    y: 52,
    font: regularFont,
    size: 10,
    color: BRAND.mutedText,
  });
  page.drawText("Ženska Pijaca", {
    x: marginLeft,
    y: 38,
    font: boldFont,
    size: 11,
    color: BRAND.primaryDark,
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
      const invoiceNumber = await getInvoiceNumber();
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
