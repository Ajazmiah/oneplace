
import "../../globals.css";
import Sidebar from "@/Components/Sidebar/Sidebar";


export const metadata = {
  title: "Resumind | Dashboard",
  description: "Dashboard with all the applications and form to add application",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6  max-w-[1460px] mx-auto">
        {children}
      </main>
    </div>
  );
}
