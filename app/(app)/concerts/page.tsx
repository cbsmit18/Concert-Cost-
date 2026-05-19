import { MyConcertsPageTabs } from "@/components/MyConcertsPageTabs";
import { PageHeader } from "@/components/PageHeader";
import { getUserConcerts } from "@/lib/concerts";

export default async function MyConcertsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const concerts = await getUserConcerts();
  const initialTab = tab === "add" ? "add" : "mine";

  return (
    <>
      <PageHeader
        title="My Concerts"
        description="View shows you have logged, or add a new concert with costs and fun ratings."
      />
      <MyConcertsPageTabs concerts={concerts} initialTab={initialTab} />
    </>
  );
}
