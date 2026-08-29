import "../../globals.css";
import Sidebar from "@/Components/Sidebar/Sidebar";
import ExtensionAuthSync from "@/Components/ExtensionAuthSync/ExtensionAuthSync";
import { auth } from "@/auth";

export const metadata = {
  title: "Resumind | Dashboard",
  description:
    "Dashboard with all the applications and form to add application",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-1 space-y-6">
        {children}
      </div>

      <ExtensionAuthSync user={user} />
    </div>
  );
}
