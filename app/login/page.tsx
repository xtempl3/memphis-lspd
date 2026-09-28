"use client";
import { signIn } from "next-auth/react";
export default function Login() {
  return <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}><div className="card" style={{ padding: 32, width: 340 }}>
    <h2>LSPD PORTAL</h2><p className="mute">Los Santos Police Department</p>
    <button className="btn" style={{ width: "100%" }} onClick={() => signIn("discord", { callbackUrl: "/" })}>Войти через Discord</button></div></div>;
}
