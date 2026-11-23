"use client";

import { useEffect } from "react";
import { notifyExtension } from "@/app/lib/utils/notifyExtension";

export default function ExtensionAuthSync({
  user,
  socialLinks,
  questionsAndAnswers,
  profile,
  resumes,
}) {
  useEffect(() => {
    notifyExtension({
      type: "AUTH_STATE",
      user,
      socialLinks,
      questionsAndAnswers,
      profile,
      resumes,
    });
  }, [user, socialLinks, questionsAndAnswers, profile, resumes]);

  return null;
}
