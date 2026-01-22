import { redirect } from "next/navigation";

export default function QuestRootRedirect() {
  // Redirect /quest -> /pet
  redirect("/pet");
}
