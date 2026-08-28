const LOGIN_URL = "http://localhost:3000/signin";

function SidePanel() {
  const login = () => chrome.tabs.create({ url: LOGIN_URL });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 24,
        padding: 24,
        fontFamily: "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <img src="/logo.svg" alt="OnePlace" style={{ width: "100%", maxWidth: 220 }} />
      <button
        onClick={login}
        style={{
          padding: "10px 24px",
          fontSize: 15,
          fontWeight: 500,
          color: "#fff",
          background: "#0bbcaa",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Log in
      </button>
    </div>
  );
}

export default SidePanel;
