import { HomeClient } from "./HomeClient";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem 1rem",
        maxWidth: "896px",
        margin: "0 auto",
        background: "#0a0f1a",
        color: "#e5e7eb",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "2rem", margin: 0 }}>
          Secureasy
        </h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Attack surface visibility for small businesses
        </p>
      </header>

      <HomeClient />
    </main>
  );
}
