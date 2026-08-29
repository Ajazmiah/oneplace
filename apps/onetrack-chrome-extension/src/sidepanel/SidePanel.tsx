import { useEffect, useState } from "react";

const LOGIN_URL = "http://localhost:3000/signin";
const DASHBOARD_URL = "http://localhost:3000/dashboard/applications";

type AuthUser = {
  name?: string;
  email?: string;
  image?: string;
} | null;

const s: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: 20,
    padding: 24,
    fontFamily: "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
  },
  logo: { width: "100%", maxWidth: 220 },
  avatar: { width: 64, height: 64, borderRadius: "50%", objectFit: "cover" },
  welcome: { margin: 0, textAlign: "center", fontSize: 15, color: "#111" },
  button: {
    padding: "10px 24px",
    fontSize: 15,
    fontWeight: 500,
    color: "#fff",
    background: "#0bbcaa",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};

function SidePanel() {
  // undefined = still reading storage, null = read but no user, object = logged in
  const [authUser, setAuthUser] = useState<AuthUser | undefined>(undefined);

  useEffect(() => {
    chrome.storage.local.get(["authUser"], (result) => {
      setAuthUser(result.authUser ?? null);
    });

    const onChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area !== "local" || !changes.authUser) return;
      setAuthUser(changes.authUser.newValue ?? null);
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, []);

  const login = () => chrome.tabs.create({ url: LOGIN_URL });
  const openDashboard = () => chrome.tabs.create({ url: DASHBOARD_URL });

  if (authUser === undefined) {
    // Avoid flashing the logged-out view while storage is still being read.
    return <div style={s.wrap} />;
  }

  return (
    <div style={s.wrap}>
      <img src="/logo.svg" alt="OnePlace" style={s.logo} />

      {authUser ? (
        <>
          {authUser.image && (
            <img src={authUser.image} alt={authUser.name ?? "User"} style={s.avatar} />
          )}
          <p style={s.welcome}>
            Welcome to OnePlace{authUser.name ? `, ${authUser.name}` : ""}!
          </p>
          <button onClick={openDashboard} style={s.button}>
            Open Dashboard
          </button>
        </>
      ) : (
        <button onClick={login} style={s.button}>
          Log in
        </button>
      )}
    </div>
  );
}

export default SidePanel;
