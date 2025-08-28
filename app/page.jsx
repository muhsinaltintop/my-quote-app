// app/page.js
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main style={{ display:"grid", gap:16 }}>
      <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h1 style={{ fontSize:24, fontWeight:600 }}>Teklif Uygulaması</h1>
        <SignedIn><UserButton /></SignedIn>
      </header>

      <SignedOut>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", padding:24, borderRadius:12 }}>
          <h2 style={{ fontSize:20, marginBottom:8 }}>Hoş geldiniz</h2>
          <p style={{ marginBottom:12 }}>Devam etmek için giriş yapın.</p>
          <Link href="/sign-in" style={{ border:"1px solid #111827", padding:"8px 14px", borderRadius:10 }}>
            Giriş Yap
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", padding:24, borderRadius:12 }}>
          <p style={{ marginBottom:12 }}>Panele geçin ve teklif oluşturun.</p>
          <Link href="/dashboard" style={{ background:"#111827", color:"#fff", padding:"8px 14px", borderRadius:10 }}>
            Panele Git
          </Link>
        </div>
      </SignedIn>
    </main>
  );
}
