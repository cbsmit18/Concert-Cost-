import { PageHeader } from "@/components/PageHeader";
import { UpcomingConcertsTab } from "@/components/UpcomingConcertsTab";

export default function UpcomingConcertsPage() {
  return (
    <>
      <PageHeader
        title="Upcoming Concerts"
        description="Search by city and artist to discover shows you might want to attend."
      />
      <UpcomingConcertsTab />
    </>
  );
}
