import ConnectAccount from "@/components/connectAccount";
import useWeb3Store from "@/hooks/useWeb3Store";
import VoteDetailView from "@/views/vote-detail";

function VotePage() {
  const account = useWeb3Store((state) => state.account);

  if (account) return <VoteDetailView />;

  return <ConnectAccount />;
}

export default VotePage;
