import { auth } from "@/auth";
import ProfilePage from "@/Components/Profile/ProfilePage";

export default async function ProfileRoute() {
  const session = await auth();

  return (
    <ProfilePage
      name={session?.user?.name}
      email={session?.user?.email}
      image={session?.user?.image}
    />
  );
}
