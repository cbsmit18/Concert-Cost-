import { ui } from "@/lib/ui-classes";

import { Music } from "lucide-react";



export function EmptyState({

  title = "No concerts logged yet",

  message = "No concerts logged yet. Add your first concert to start seeing your dashboard.",

  action,

}: {

  title?: string;

  message?: string;

  action?: React.ReactNode;

}) {

  return (

    <div className="surface-card border-dashed motion-safe-hover-lift">

      <div className="flex flex-col items-center text-center py-16 px-6 gap-4">

        <div

          className={`${ui.iconWrap} rounded-full p-5 animate-pulse`}

          aria-hidden

        >

          <Music className="h-10 w-10" />

        </div>

        <h3 className="text-section-title text-xl">{title}</h3>

        <p className={`${ui.bodyText} max-w-md`}>{message}</p>

        {action ? <div className="mt-2">{action}</div> : null}

      </div>

    </div>

  );

}

