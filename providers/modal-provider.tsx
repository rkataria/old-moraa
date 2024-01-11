
"use client";

import { useEffect, useState } from "react";
import { CreateEventModal } from "@/app/(dashboard)/(routes)/events/__components/CreateEventModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateEventModal />
    </>
  );
};
