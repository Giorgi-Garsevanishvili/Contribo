import { redirectByRole } from "@/lib/roleRedirects";
import "server-only";

export default async function RedirectPage() {
  await redirectByRole();
}
