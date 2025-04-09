import { getSessionData } from "@/lib/session";
import { ModalProvider } from "./modal-provider";

export default async function ServerModalProvider() {
  const session = await getSessionData();

  return <ModalProvider session={session} />;
}
