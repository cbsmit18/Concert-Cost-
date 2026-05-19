import { ConcertForm } from "@/components/ConcertForm";

import { PageHeader } from "@/components/PageHeader";



export default function AddConcertPage() {

  return (

    <>

      <PageHeader

        title="Add Concert"

        description="Log a show you attended, every cost, and how much fun you had."

      />

      <ConcertForm />

    </>

  );

}

