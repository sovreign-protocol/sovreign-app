import ConnectAccount from "@/components/connectAccount";
import useWeb3Store from "@/hooks/useWeb3Store";
import CreateProposal from "@/views/create-proposal";

function VotePage() {
  const account = useWeb3Store((state) => state.account);

  if (account) return <CreateProposal />;

  return <ConnectAccount />;
}

export default VotePage;
