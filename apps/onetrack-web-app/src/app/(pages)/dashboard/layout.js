import "../../globals.css";
import Sidebar from "@/Components/Sidebar/Sidebar";

export const metadata = {
  title: "Resumind | Dashboard",
  description:
    "Dashboard with all the applications and form to add application",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-1 space-y-6">
        {children}
      </div>
    </div>
  );
}
