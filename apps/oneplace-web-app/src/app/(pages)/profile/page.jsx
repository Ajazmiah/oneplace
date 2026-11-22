import { getSocialLinks } from "@/app/lib/DataAccessLayer/socialLinks";
import { getApplications } from "@/app/lib/DataAccessLayer/applications";
import { getProfile } from "@/app/lib/DataAccessLayer/profile";
import { auth } from "@/auth";
import ProfilePage from "@/Components/Profile/ProfilePage";

export default async function ProfileRoute() {
  const session = await auth();

  const [socialLinks, applications, profile] = await Promise.all([
    getSocialLinks(),
    getApplications(),
    getProfile(),
  ]);

  return (
    <ProfilePage
      name={session?.user?.name}
      email={session?.user?.email}
      image={session?.user?.image}
      socialLinks={socialLinks}
      applications={applications}
      profile={profile}
    />
  );
}
