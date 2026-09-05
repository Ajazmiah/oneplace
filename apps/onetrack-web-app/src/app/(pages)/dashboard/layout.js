import "../../globals.css";
import Sidebar from "@/Components/Sidebar/Sidebar";
import ExtensionAuthSync from "@/Components/ExtensionAuthSync/ExtensionAuthSync";
import { getCachedAuthSession } from "@/app/lib/utils/getCachedSession";
import { getSocialLinks } from "@/app/lib/DataAccessLayer/socialLinks";
import { getQuestionsAndAnswers } from "@/app/lib/DataAccessLayer/getQuestionsAndAnswers";

export const metadata = {
  title: "Resumind | Dashboard",
  description:
    "Dashboard with all the applications and form to add application",
};

export default async function RootLayout({ children }) {
  const session = await getCachedAuthSession();
  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;
  const socialLinks = user ? await getSocialLinks() : [];
  const questionsAndAnswers = user ? await getQuestionsAndAnswers() : [];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-1 space-y-6">
        {children}
      </div>

      <ExtensionAuthSync
        user={user}
        socialLinks={socialLinks}
        questionsAndAnswers={questionsAndAnswers}
      />
    </div>
  );
}
