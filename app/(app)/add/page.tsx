import { redirect } from "next/navigation";

export default function AddConcertPage() {
  redirect("/concerts?tab=add");
}
