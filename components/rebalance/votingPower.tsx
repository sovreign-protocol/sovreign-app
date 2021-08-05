import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useVotingPower from "@/hooks/view/useVotingPower";

export default function VotingPower() {
  const { data: votingPower } = useVotingPower();

  const fmVotingPower = useFormattedBigNumber(votingPower);

  return (
    <div className="space-y-4">
      <h2 className="font-medium leading-5">Voting Power</h2>

      <p className="text-2xl leading-none font-semibold">{fmVotingPower}</p>
    </div>
  );
}
