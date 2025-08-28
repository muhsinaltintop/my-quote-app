import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div style={{ display:"flex", justifyContent:"center", padding:"40px 0" }}>
      <SignIn routing="path" />
    </div>
  );
}
