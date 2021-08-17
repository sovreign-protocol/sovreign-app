import ConnectAccount from "@/components/connectAccount";
import useWeb3Store from "@/hooks/useWeb3Store";
import FarmingView from "@/views/farming";

function FarmingPage() {
  const account = useWeb3Store((state) => state.account);

  if (account) return <FarmingView />;

  return <ConnectAccount />;
}

export default FarmingPage;
