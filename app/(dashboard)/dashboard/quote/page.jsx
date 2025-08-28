import QuoteForm from "./QuoteForm";
import { UserButton } from "@clerk/nextjs";

export default function QuotePage() {
  return (
    <main style={{ display:"grid", gap:24 }}>
      <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h1 style={{ fontSize:24, fontWeight:600 }}>Fiyat Teklifi</h1>
        <UserButton />
      </header>
      <QuoteForm />
    </main>
  );
}
