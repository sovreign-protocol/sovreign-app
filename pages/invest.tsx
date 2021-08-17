import ConnectAccount from "@/components/connectAccount";
import useWeb3Store from "@/hooks/useWeb3Store";
import InvestView from "@/views/invest";

function InvestPage() {
  const account = useWeb3Store((state) => state.account);

  if (account) return <InvestView />;

  return <ConnectAccount />;
}

export default InvestPage;
