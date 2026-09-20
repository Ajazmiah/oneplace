import { getSocialLinks } from "@/app/lib/DataAccessLayer/socialLinks";
import { getApplications } from "@/app/lib/DataAccessLayer/applications";
import { auth } from "@/auth";
import ProfilePage from "@/Components/Profile/ProfilePage";

export default async function ProfileRoute() {
  const session = await auth();

  const socialLinks = await getSocialLinks();
  const applications = await getApplications();

  return (
    <ProfilePage
      name={session?.user?.name}
      email={session?.user?.email}
      image={session?.user?.image}
      socialLinks={socialLinks}
      applications={applications}
    />
  );
}
