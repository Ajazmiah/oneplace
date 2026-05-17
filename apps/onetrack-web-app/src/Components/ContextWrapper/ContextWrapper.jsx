"use client";

import { ApplicationContextProvider } from "@/context";
import React from "react";

export default function withApplicationContext(Component) {
  return function WrappedComponent(props) {
    return (
      <ApplicationContextProvider>
        <Component {...props} />
      </ApplicationContextProvider>
    );
  };
}

