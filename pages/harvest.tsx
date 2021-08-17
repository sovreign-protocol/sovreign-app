import ConnectAccount from "@/components/connectAccount";
import useWeb3Store from "@/hooks/useWeb3Store";
import HarvestView from "@/views/harvest";

function HarvestPage() {
  const account = useWeb3Store((state) => state.account);

  if (account) return <HarvestView />;

  return <ConnectAccount />;
}

export default HarvestPage;
