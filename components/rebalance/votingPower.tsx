import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useVotingPower from "@/hooks/view/useVotingPower";
import Link from "next/link";
import { Plus } from "react-feather";

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
    <>
      <div className="flex-1 bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="font-medium leading-5">Total Voting Power</h2>

          <Link href="/stake">
            <a>
              <Plus size={20} />
            </a>
          </Link>
        </div>

        <p className="text-2xl leading-none font-semibold">
          {fmCurrentVotingPower} <span className="text-gray-500">/</span>
          <br />
          <span className="text-lg leading-none">{`${fmTotal} votes`}</span>
        </p>
      </div>

      <div className="flex-1 bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="font-medium leading-5">Current Voting Power</h2>
        </div>

        <p className="text-2xl leading-none font-semibold">
          {fmVotingPowerAtLastEpoch} <span className="text-gray-500">/</span>
          <br />
          <span className="text-lg leading-none">{`${fmTotalAtLastEpoch} votes`}</span>
        </p>
      </div>
    </>
  );
}
