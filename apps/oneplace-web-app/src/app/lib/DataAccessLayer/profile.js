import { cacheTag, cacheLife } from "next/cache";
import Profile from "@/database/models/profileModel";
import { getUserByEmail } from "@/app/lib/utils/databaseUtils";
import { getUserSession } from "./getSession";

// Read-only, called from server components. Not a "use server" file on purpose: that would
// also expose it to the browser as a callable action. saveProfile updates the same tag.

async function getCachedProfile(userId) {
  "use cache";
  cacheLife("hours");
  cacheTag(`profile-${userId}`);

  const profile = await Profile.findOne({ userId }).select("-_id -userId -__v").lean();
  // Plain JSON (Dates become ISO strings) so it can be passed to client components
  return profile ? JSON.parse(JSON.stringify(profile)) : null;
}

/** The signed-in user's autofill profile, or null if they haven't saved one yet. */
export const getProfile = async () => {
  const session = await getUserSession();
  const user = await getUserByEmail(session.user.email);
  if (!user) return null;
  return getCachedProfile(user._id.toString());
};
