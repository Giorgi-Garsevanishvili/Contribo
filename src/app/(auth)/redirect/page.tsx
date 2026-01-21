import "server-only";
import { redirectByRole } from "@/lib/roleRedirects";

export default async function RedirectPage() {
  await redirectByRole();
}
