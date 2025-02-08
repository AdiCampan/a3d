import { SessionProvider } from "../ctx";
import { Redirect, Slot } from "expo-router";
import React from "react";

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
