"use client";

import { useEffect } from "react";
import { notifyExtension } from "@/app/lib/utils/notifyExtension";

export default function ExtensionAuthSync({ user, socialLinks, questionsAndAnswers }) {
  useEffect(() => {
    notifyExtension({ type: "AUTH_STATE", user, socialLinks, questionsAndAnswers });
  }, [user, socialLinks, questionsAndAnswers]);

  return null;
}
