import NewEventButtonWithModal from "@/components/common/NewEventButtonWithModal";
import EventList from "@/components/events/EventList";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function EventsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  const id = user?.id;
  if (!user) {
    return <></>;
  }
  const { data, error } = await supabase
    .from("enrollment")
    .select("*,event(*)")
    .eq("user_id", id);

  const events = data?.map((i) => i.event);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto"></div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <NewEventButtonWithModal />
        </div>
      </div>
      {data?.length === 0 ? <></> : <EventList events={events} />}
    </div>
  );
}
