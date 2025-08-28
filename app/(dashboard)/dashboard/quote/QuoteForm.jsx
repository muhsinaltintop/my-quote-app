"use client";
import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const currency = (n) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" })
    .format(Number(n || 0));

export default function QuoteForm() {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ description: "", price: "" }]);
  const [notes, setNotes] = useState(
    "* Bu teklif 15 gün geçerlidir.\n* Fiyatlara KDV dahil değildir (aksi belirtilmedikçe).\n* Ödeme planı: %50 peşin, %50 teslimatta."
  );

  const addItem = () => setItems((p) => [...p, { description: "", price: "" }]);
  const removeItem = (idx) => setItems((p) => p.filter((_, i) => i !== idx));
  const updateItem = (idx, key, val) =>
    setItems((p) => p.map((it, i) => (i === idx ? { ...it, [key]: val } : it)));

  const total = items.reduce((s, it) => s + Number((it.price + "").replace(",", ".") || 0), 0);

  const onSubmit = async (e) => {
    e.preventDefault();

    // PDF oluştur ve fontkit kaydet
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Türkçe destekli statik TTF fontları yükle (public/ altından servis edilir)
    const [regularBytes, boldBytes] = await Promise.all([
      fetch("/fonts/Roboto-Regular.ttf", { cache: "no-store" }).then((r) => r.arrayBuffer()),
      fetch("/fonts/Roboto-Bold.ttf",    { cache: "no-store" }).then((r) => r.arrayBuffer()),
    ]);

    // subset: false — bazı görüntüleyicilerde bozulmayı engeller
    const regularFont = await pdfDoc.embedFont(regularBytes, { subset: false });
    const boldFont    = await pdfDoc.embedFont(boldBytes,    { subset: false });

    const page = pdfDoc.addPage([595.28, 841.89]); // A4 (pt)
    const { width, height } = page.getSize();

    const margin = 50;
    let y = height - margin;

    const drawText = (text, x, y, opts = {}) => {
      page.drawText(String(text ?? ""), {
        x,
        y,
        size: opts.size ?? 12,
        font: opts.bold ? boldFont : regularFont,
        color: opts.color ?? rgb(0, 0, 0),
      });
    };

    // Başlık
    drawText("FİYAT TEKLİFİ", margin, y, { size: 18, bold: true });
    drawText(new Date().toLocaleDateString("tr-TR"), width - margin - 120, y);
    y -= 24;

    drawText("Müşteri:", margin, y, { bold: true });
    drawText(customerName || "—", margin + 70, y);
    y -= 24;

    // Tablo başlığı
    drawText("#", margin, y, { bold: true });
    drawText("Hizmet Açıklaması", margin + 25, y, { bold: true });
    drawText("Fiyat (TRY)", width - margin - 120, y, { bold: true });
    y -= 12;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= 12;

    // Satırlar
    let idx = 1;
    let toplam = 0;
    for (const it of items) {
      const desc = (it?.description ?? "").trim() || "—";
      const priceNum = Number((it?.price + "").replace(",", ".") || 0);
      toplam += priceNum;

      drawText(String(idx), margin, y);
      drawText(desc, margin + 25, y);
      drawText(
        priceNum.toLocaleString("tr-TR", { style: "currency", currency: "TRY" }),
        width - margin - 120,
        y
      );
      y -= 18;

      // Basit alt sınır kontrolü (çok kalem olursa yeni sayfa eklemek istersen geliştiririz)
      if (y < margin + 150) {
        drawText("…devam eder", width - margin - 80, margin, { size: 10 });
        y = height - margin;
      }
      idx++;
    }

    y -= 10;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1.2,
      color: rgb(0, 0, 0),
    });
    y -= 20;

    drawText("Toplam:", width - margin - 200, y, { bold: true });
    drawText(
      toplam.toLocaleString("tr-TR", { style: "currency", currency: "TRY" }),
      width - margin - 120,
      y,
      { bold: true }
    );
    y -= 30;

    drawText("Notlar / Şartlar:", margin, y, { bold: true });
    y -= 18;

    String(notes).split("\n").forEach((line) => {
      drawText(line, margin, y);
      y -= 16;
    });

    // Alt bilgi
    y = Math.max(y, 80);
    page.drawLine({
      start: { x: margin, y: 70 },
      end: { x: width - margin, y: 70 },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });
    drawText("Şirket Adı • Adres • email@domain.com • +44 0000 000000", margin, 50, { size: 10 });

    // Kaydetmeden indirme
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teklif-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        padding: 24,
        borderRadius: 12,
        display: "grid",
        gap: 16,
      }}
    >
      <label>
        <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
          Müşteri Adı Soyadı
        </div>
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Ad Soyad"
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        />
      </label>

      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600 }}>Hizmet Kalemleri</h3>
          <button
            type="button"
            onClick={addItem}
            style={{
              background: "#111827",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
            }}
          >
            + Kalem Ekle
          </button>
        </div>

        {items.map((it, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 180px 80px",
              gap: 10,
            }}
          >
            <input
              required
              value={it.description}
              onChange={(e) =>
                updateItem(idx, "description", e.target.value)
              }
              placeholder={`Hizmet açıklaması #${idx + 1}`}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            />
            <input
              required
              inputMode="decimal"
              value={it.price}
              onChange={(e) => updateItem(idx, "price", e.target.value)}
              placeholder="Fiyat (TRY)"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              aria-label={`Kalem ${idx + 1} sil`}
              style={{ border: "1px solid #e5e7eb", borderRadius: 10 }}
            >
              Sil
            </button>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 14, color: "#4b5563" }}>Toplam:</span>
          <strong style={{ fontSize: 18 }}>{currency(total)}</strong>
        </div>
      </div>

      <label>
        <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
          Standart Notlar / Şartlar
        </div>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        />
      </label>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          type="submit"
          style={{
            background: "#111827",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
          }}
        >
          PDF Oluştur
        </button>
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          PDF indirme olarak gelecektir.
        </span>
      </div>
    </form>
  );
}
