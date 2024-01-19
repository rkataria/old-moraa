"use client";
import Header from "@/components/slides/Header";
// import  '@/app/globals.css';
import { useEvent } from "@/hooks/useEvent";

export default function RootLayout({ params, children }: any) {
  const { eventId } = params;
  const { event, error } = useEvent({ id: eventId });

  if (error) {
    return null;
  }


  return (
    <div>
      <Header event={event} />
      {children}
    </div>
  );
}
