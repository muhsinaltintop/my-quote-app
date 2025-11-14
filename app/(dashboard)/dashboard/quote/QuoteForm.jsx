"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";


const currency = (n) =>
  new Intl.NumberFormat("en-EN", { style: "currency", currency: "USD" }).format(
    Number(n || 0)
  );

export default function QuoteForm() {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ description: "", price: "" }]);

  const [notes, setNotes] = useState(`Notlar – E-2 Antlaşmalı Yatırımcı Statüsü

1. Hizmet Kapsamı 

Bu teklif, ABD içinde Statü Değişikliği (Form I-129) yoluyla E-2 Antlaşmalı Yatırımcı statüsü başvurusu ile ilgili hukuki hizmetleri kapsamaktadır. 

Bu teklif kapsamındaki hukuki hizmetler: 

ABD göçmenlik hukuku kapsamında E-2 Antlaşmalı Yatırımcı statüsüne uygunluğun değerlendirilmesi 

Yatırım ve işletmenin hazırlanması ve yapılandırılması konusunda danışmanlık 

Form I-129 Yabancı Çalışan için Dilekçe (Petition for a Nonimmigrant Worker) ve E-2 Ek Formunun hazırlanması ve gözden geçirilmesi 

Destekleyici belgelerin hazırlanmasına yönelik danışmanlık (şirket kuruluş belgeleri, mali kayıtlar, yatırım kanıtları, sahiplik yapısı, iş planı vb.) 

Başvuru süreci boyunca yasal statünün korunmasına ilişkin hukuki strateji geliştirilmesi 

USCIS ile dilekçe sürecinin takibi ve olası Ek Delil Talepleri (RFE) için hazırlık yapılması 

Bu teklif kapsamında olmayan ve ayrıca faturalandırılacak hizmetler: 

USCIS dosyalama harçları (Form I-129 ve biyometri, eğer uygulanırsa) 

Kurumsal veya kişisel belgelerin tercümesi veya noter onayı 

Şirketin muhasebe, vergi beyanı veya iş operasyonlarıyla ilgili profesyonel hizmetler 

İlk hazırlığın ötesindeki itirazlar, dilekçeler veya RFE/NOID cevapları 

Üçüncü taraf giderleri (kargo, apostil, değerlendirmeler, tercümeler vb.) 

2. Başlangıç Ödemesi 

E-2 statüsü başvuru sürecini başlatmak için 3.000 USD tutarında bir başlangıç ödemesi gerekmektedir. 
Ödeme yöntemleri ve hesap bilgileri bir sonraki sayfada sunulacaktır. 

3. Sürecin Durdurulması 

Başvuru sürecinin herhangi bir nedenle durdurulması halinde, o ana kadar yapılan çalışmalar aşağıdaki saatlik ücretlere göre hesaplanır ve kalan bakiye buna göre güncellenir: 

Avukat saatlik ücreti: 350 USD 

Asistan/ekip saatlik ücreti: 150 USD 

4. Vekalet Anlaşması 

Bu teklifin onaylanmasının ardından, resmi E-2 Antlaşmalı Yatırımcı Vekalet Anlaşması tarafınıza iletilecektir. 

Bu anlaşma, aşağıdaki hususları detaylı şekilde düzenleyecektir: 

Tarafların hak ve yükümlülükleri 

Hizmet kapsamı 

Ücretlendirme esasları 

Gizlilik hükümleri`);

  const [paymentInfo, setPaymentInfo] = useState(`ÖDEME TALİMATLARI 

ABD İÇİNDEN GÖNDERİLEN HAVALE (WIRE TRANSFER) ÖDEMELERİ İÇİN  

BANKA ADI: BANK OF AMERICA 

BANKA ADRESİ: 1212 Hwy 6, Sugar Land, Texas 77478 
HESAP SAHİBİ ADI: YILDIZ LAW FIRM PLLC 
ROUTING (YÖNLENDİRME) NUMARASI (BANKADAN): 026009593 

ACH YÖNLENDİRME NUMARASI (KAĞIT ÇEK İLE ÖDEMELER): 111000023 

ACH YÖNLENDİRME NUMARASI (ELEKTRONİK ÖDEMELER): 111000025 
HESAP NUMARASI: 586038775342 
FATURA ADRESİ: 4426 Tilbury Trail, Richmond, Texas 77407 

ABD DIŞINDAN GÖNDERİLEN HAVALE (WIRE TRANSFER) ÖDEMELERİ İÇİN 
 

BANKA: BANK OF AMERICA 

BANKA ADRESİ: 1212 Hwy 6, Sugar Land, Texas 77478 
HESAP ADI: YILDIZ LAW FIRM PLLC 

SWIFT KODU (EĞER PARA ABD DOLARI OLARAK GÖNDERİLİYORSA): BOFAUS3N 
SWIFT KODU (EĞER PARA YABANCI BİR PARA BİRİMİ OLARAK GÖNDERİLİYORSA): BOFAUS6S 

ROUTING (YÖNLENDİRME) NUMARASI (BANKADAN): 026009593 

ABA (ROUTING) NUMARASI (KAĞIT ÇEK İLE ÖDEMELER): 111000023 
ABA (ROUTING) NUMARASI (ELEKTRONİK ÖDEMELER): 111000025 
HESAP NUMARASI: 586038775342 
FATURA ADRESİ: 4426 Tilbury Trail, Richmond, Texas 77407 

ÇEKLE YAPILAN ÖDEMELER İÇİN 
 

Tüm çekler “YILDIZ LAW FIRM PLLC” adına yazılmalıdır. 
Çekle yapılan ödemeler aşağıdaki adrese muhasebe biriminin dikkatine gönderilmelidir: 
4426 Tilbury Trail, Richmond, Texas 77407 

ZELLE İLE YAPILAN ÖDEMELER İÇİN 
 

Aşağıdaki e-posta adresi veya telefon numarası kullanılmalıdır: 
E-POSTA: accounting@yildiz.law 
TELEFON NUMARASI: 347-484-4263`);

  const addItem = () =>
    setItems((prev) => [...prev, { description: "", price: "" }]);
  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, key, val) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [key]: val } : it))
    );

  const total = items.reduce(
    (s, it) => s + Number((it.price + "").replace(",", ".") || 0),
    0
  );

  const onSubmit = async (e) => {
  e.preventDefault();

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // /public/fonts klasöründe bu dosyaların olduğundan emin ol:
  // public/fonts/Roboto-Regular.ttf
  // public/fonts/Roboto-Bold.ttf
  const [regularBytes, boldBytes] = await Promise.all([
    fetch("/fonts/Roboto-Regular.ttf", { cache: "no-store" }).then((r) =>
      r.arrayBuffer()
    ),
    fetch("/fonts/Roboto-Bold.ttf", { cache: "no-store" }).then((r) =>
      r.arrayBuffer()
    ),
  ]);

  const regularFont = await pdfDoc.embedFont(regularBytes, { subset: false });
  const boldFont = await pdfDoc.embedFont(boldBytes, { subset: false });


    const pageSize = [595.28, 841.89]; // A4 (pt)

    /* === 1) KAPAK === */
    {
      const page = pdfDoc.addPage(pageSize);
      const { width, height } = page.getSize();

      const title = "E-2 Yatırımcı Vizesi\nTeklif Yazısı";
      const dateStr = new Date().toLocaleDateString("tr-TR");

      page.drawText("YILDIZ LAW FIRM PLLC", {
        x: 50,
        y: height - 80,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Tarih: ${dateStr}`, {
        x: 50,
        y: height - 110,
        size: 12,
        font: regularFont,
      });

      if (customerName.trim()) {
        page.drawText(`Hazırlayan: YILDIZ LAW FIRM PLLC`, {
          x: 50,
          y: height - 140,
          size: 12,
          font: regularFont,
        });
        page.drawText(`Müşteri: ${customerName}`, {
          x: 50,
          y: height - 160,
          size: 12,
          font: regularFont,
        });
      }

      page.drawText(title, {
        x: 50,
        y: height / 2,
        size: 28,
        font: boldFont,
      });

      page.drawText(
        "Bu fiyat teklifi, belirtilen tarihten itibaren 14 gün süreyle geçerlidir.",
        {
          x: 50,
          y: height / 2 - 60,
          size: 12,
          font: regularFont,
        }
      );
    }

    /* === 2) FİYAT TEKLİFİ (TABLO) === */
    {
      const page = pdfDoc.addPage(pageSize);
      const { width, height } = page.getSize();
      const margin = 50;
      let y = height - margin;

      const draw = (text, x, y, opts = {}) => {
        page.drawText(String(text ?? ""), {
          x,
          y,
          size: opts.size ?? 12,
          font: opts.bold ? boldFont : regularFont,
          color: opts.color ?? rgb(0, 0, 0),
        });
      };

      draw("FİYAT TEKLİFİ", margin, y, { size: 18, bold: true });
      draw(new Date().toLocaleDateString("tr-TR"), width - margin - 120, y);
      y -= 24;

      draw("Müşteri:", margin, y, { bold: true });
      draw(customerName || "—", margin + 70, y);
      y -= 24;

      // tablo başlığı
      draw("#", margin, y, { bold: true });
      draw("Hizmet Açıklaması", margin + 25, y, { bold: true });
      draw("Fiyat (USD)", width - margin - 120, y, { bold: true });
      y -= 12;

      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      y -= 12;

      let idx = 1;
      let toplam = 0;

      for (const it of items) {
        const desc = (it?.description ?? "").trim() || "—";
        const priceNum = Number((it?.price + "").replace(",", ".") || 0);
        toplam += priceNum;

        draw(String(idx), margin, y);
        draw(desc, margin + 25, y);
        draw(
          priceNum.toLocaleString("en-EN", {
            style: "currency",
            currency: "USD",
          }),
          width - margin - 160,
          y
        );
        y -= 18;

        if (y < margin + 150) {
          draw("…devam eder", width - margin - 80, margin, { size: 10 });
          break; // basitlik için; çok kalem olursa gelişmiş sayfa bölme ekleyebiliriz
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

      draw("Toplam:", width - margin - 200, y, { bold: true });
      draw(
        toplam.toLocaleString("en-EN", {
          style: "currency",
          currency: "USD",
        }),
        width - margin - 160,
        y,
        { bold: true }
      );
    }

/* === 3) NOTLAR SAYFASI === */
{
  const pageSize = [595.28, 841.89];
  let page = pdfDoc.addPage(pageSize);
  let { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  const maxWidth = width - margin * 2;
  const lineHeight = 16;

  const draw = (text, x, y, opts = {}) => {
    page.drawText(String(text ?? ""), {
      x,
      y,
      size: opts.size ?? 12,
      font: opts.bold ? boldFont : regularFont,
      color: opts.color ?? rgb(0, 0, 0),
    });
  };

  // başlık
  draw("Notlar – E-2 Antlaşmalı Yatırımcı Statüsü", margin, y, {
    bold: true,
    size: 16,
  });
  y -= 28;

  const writeLine = (ln) => {
    // yeni sayfa kontrolü
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage(pageSize);
      ({ width, height } = page.getSize());
      y = height - margin;
    }

    if (!ln) {
      // boş satır
      y -= lineHeight;
      return;
    }

    draw(ln, margin, y);
    y -= lineHeight;
  };

  const wrappedLines = wrapTextBlock(notes, regularFont, 12, maxWidth);
  wrappedLines.forEach(writeLine);
}


    /* === 4) ÖDEME TALİMATLARI SAYFASI === */
{
  const pageSize = [595.28, 841.89];
  let page = pdfDoc.addPage(pageSize);
  let { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  const maxWidth = width - margin * 2;
  const lineHeight = 16;

  const draw = (text, x, y, opts = {}) => {
    page.drawText(String(text ?? ""), {
      x,
      y,
      size: opts.size ?? 12,
      font: opts.bold ? boldFont : regularFont,
      color: opts.color ?? rgb(0, 0, 0),
    });
  };

  // başlık
  draw("ÖDEME TALİMATLARI", margin, y, { bold: true, size: 16 });
  y -= 28;

  const writeLine = (ln) => {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage(pageSize);
      ({ width, height } = page.getSize());
      y = height - margin;
    }

    if (!ln) {
      y -= lineHeight;
      return;
    }

    draw(ln, margin, y);
    y -= lineHeight;
  };

  const wrappedLines = wrapTextBlock(paymentInfo, regularFont, 12, maxWidth);
  wrappedLines.forEach(writeLine);
}


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
      className="bg-white border border-gray-200 p-6 rounded-xl grid gap-4"
    >
      <label className="grid gap-1">
        <div className="text-sm font-medium">Müşteri Adı Soyadı</div>
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Ad Soyad"
          className="w-full border border-gray-200 rounded-lg px-3 py-2"
        />
      </label>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Hizmet Kalemleri</h3>
          <button
            type="button"
            onClick={addItem}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            + Kalem Ekle
          </button>
        </div>

        {items.map((it, idx) => (
          <div key={idx} className="grid gap-2 md:grid-cols-[1fr_180px_80px]">
            <input
              required
              value={it.description}
              onChange={(e) => updateItem(idx, "description", e.target.value)}
              placeholder={`Hizmet açıklaması #${idx + 1}`}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />
            <input
              required
              inputMode="decimal"
              value={it.price}
              onChange={(e) => updateItem(idx, "price", e.target.value)}
              placeholder="Fiyat (USD)"
              className="border border-gray-200 rounded-lg px-3 py-2"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              aria-label={`Kalem ${idx + 1} sil`}
              className="border border-gray-200 rounded-lg px-3 py-2"
            >
              Sil
            </button>
          </div>
        ))}

        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-gray-600">Toplam:</span>
          <strong className="text-lg">{currency(total)}</strong>
        </div>
      </div>

      <label className="grid gap-1">
        <div className="text-sm font-medium">Notlar / Şartlar (3. sayfada)</div>
        <textarea
          rows={8}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <div className="text-sm font-medium">
          Ödeme Talimatları (4. sayfada)
        </div>
        <textarea
          rows={10}
          value={paymentInfo}
          onChange={(e) => setPaymentInfo(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-gray-900 text-white px-5 py-2.5 rounded-lg"
        >
          PDF Oluştur
        </button>
        <span className="text-sm text-gray-500">
          PDF indirme olarak gelecektir.
        </span>
      </div>
    </form>
  );
}

/* === Helpers === */

function wrapTextBlock(text, font, size, maxWidth) {
  const linesOut = [];
  const rawLines = String(text || "").split("\n");

  for (const raw of rawLines) {
    const line = raw.trimEnd();
    if (!line) {
      linesOut.push("");
      continue;
    }
    const words = line.split(" ");
    let current = "";

    for (const w of words) {
      const test = current ? current + " " + w : w;
      const width = font.widthOfTextAtSize(test, size);
      if (width > maxWidth && current) {
        linesOut.push(current);
        current = w;
      } else {
        current = test;
      }
    }

    if (current) linesOut.push(current);
  }

  return linesOut;
}
