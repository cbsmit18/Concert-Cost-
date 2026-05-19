export function Skeleton({ className = "" }: { className?: string }) {

  return <div className={`skeleton ${className}`} />;

}



export function TabsSkeleton() {

  return (

    <div className="mb-6 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm space-y-2">

      <Skeleton className="h-4 w-16" />

      <div className="flex gap-2">

        <Skeleton className="h-11 flex-1 rounded-lg" />

        <Skeleton className="h-11 flex-1 rounded-lg" />

      </div>

    </div>

  );

}



export function DashboardSkeleton() {

  return (

    <div className="space-y-8 animate-fade-in">

      <div className="space-y-2">

        <Skeleton className="h-9 w-48" />

        <Skeleton className="h-4 w-96 max-w-full" />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {Array.from({ length: 8 }).map((_, i) => (

          <Skeleton key={i} className="h-28 w-full rounded-2xl" />

        ))}

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {Array.from({ length: 4 }).map((_, i) => (

          <Skeleton key={i} className="h-72 w-full rounded-2xl" />

        ))}

      </div>

    </div>

  );

}



export function ConcertsSkeleton() {

  return (

    <div className="space-y-8 animate-fade-in">

      <div className="space-y-2">

        <Skeleton className="h-9 w-48" />

        <Skeleton className="h-4 w-80 max-w-full" />

      </div>

      <TabsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {Array.from({ length: 4 }).map((_, i) => (

          <Skeleton key={i} className="h-64 w-full rounded-2xl" />

        ))}

      </div>

    </div>

  );

}

