import { injected } from "@/lib/connectors/metamask";
import toast from "react-hot-toast";
import Button from "./button";

export default function ConnectAccount() {
  async function connect() {
    try {
      await injected.activate();
    } catch (error) {
      console.error(error);

      toast.error(error.message);
    }
  }

  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-md mx-auto mb-4">
        <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
          <div className="space-y-4">
            <h1 className="text-lg font-semibold text-center">
              Connect your Wallet
            </h1>

            <Button onClick={connect}>Connect Wallet</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
