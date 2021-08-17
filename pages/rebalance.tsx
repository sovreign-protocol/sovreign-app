import ConnectAccount from "@/components/connectAccount";
import useWeb3Store from "@/hooks/useWeb3Store";
import RebalanceView from "@/views/rebalance";

function RebalancePage() {
  const account = useWeb3Store((state) => state.account);

  if (account) return <RebalanceView />;

  return <ConnectAccount />;
}

export default RebalancePage;
