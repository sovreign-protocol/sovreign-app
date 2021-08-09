import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useVotingPower from "@/hooks/view/useVotingPower";

export default function VotingPower() {
  const { data: votingPower } = useVotingPower();

  const fmCurrentVotingPower = useFormattedBigNumber(
    votingPower?.currentVotingPower,
    0
  );

  const fmVotingPowerAtLastEpoch = useFormattedBigNumber(
    votingPower?.votingPowerAtLastEpoch,
    0
  );

  const fmTotalAtLastEpoch = useFormattedBigNumber(
    votingPower?.totalAtLastEpoch,
    0
  );

  const fmTotal = useFormattedBigNumber(votingPower?.total, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-medium leading-5 mb-4">Current Voting Power</h2>

        <p className="text-2xl leading-none font-semibold">
          {fmCurrentVotingPower} <span className="text-gray-500">/</span>{" "}
          <span className="text-lg leading-none">{`${fmTotal} votes`}</span>
        </p>
      </div>

      <div className="h-px w-full bg-primary-300" />

      <div>
        <h2 className="font-medium leading-5 mb-4">
          Voting Power At Last Epoch
        </h2>

        <p className="text-2xl leading-none font-semibold">
          {fmVotingPowerAtLastEpoch} <span className="text-gray-500">/</span>{" "}
          <span className="text-lg leading-none">{`${fmTotalAtLastEpoch} votes`}</span>
        </p>
      </div>
    </div>
  );
}
