import { ConcertsPageTabs } from "@/components/ConcertsPageTabs";

import { PageHeader } from "@/components/PageHeader";

import { getUserConcerts } from "@/lib/concerts";



export default async function MyConcertsPage() {

  const concerts = await getUserConcerts();



  return (

    <>

      <PageHeader

        title="My Concerts"

        description="Every show you have logged, with costs, fun ratings, and value scores."

      />



      <ConcertsPageTabs concerts={concerts} />

    </>

  );

}

