"use client";

import { useEffect } from "react";
import { notifyExtension } from "@/app/lib/utils/notifyExtension";

export default function ExtensionAuthSync({ user, socialLinks, questionsAndAnswers, profile }) {
  useEffect(() => {
    notifyExtension({ type: "AUTH_STATE", user, socialLinks, questionsAndAnswers, profile });
  }, [user, socialLinks, questionsAndAnswers, profile]);

  return null;
}
