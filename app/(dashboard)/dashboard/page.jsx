import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main style={{ display: "grid", gap: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel</h1>
        <UserButton />
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Link
          href="/dashboard/quote"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            background: "#fff",
            textDecoration: "none",
            color: "#111827",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
            1) Fiyat Teklifi Oluştur
          </h2>
          <p style={{ fontSize: 14, color: "#4b5563" }}>
            İsim, hizmet ve fiyat girerek PDF oluşturun.
          </p>
        </Link>

        <button
          type="button"
          disabled
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            background: "#f3f4f6",
            color: "#9ca3af",
            textAlign: "left",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
            2) (Yakında) — Diğer İşlem
          </h2>
          <p style={{ fontSize: 14 }}>İleride eklenecek işlemler.</p>
        </button>
      </div>
    </main>
  );
}
