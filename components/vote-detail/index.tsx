import { DAO_THRESHOLD } from "@/constants/numbers";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useVotingPower from "@/hooks/view/useVotingPower";
import { commify, formatUnits } from "@ethersproject/units";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Panel from "../panel";
import NumericalInput from "../numericalInput";
import TokenSelect, { Token } from "../tokenSelect";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import useInput from "@/hooks/useInput";
import { ArrowLeft } from "react-feather";

export default function DAOProgress() {
  const [depositToken, depositTokenSet] = useState<Token>();
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: votingPower } = useVotingPower();
  const { data: poolTokens } = useGetPoolTokens();

  const progress = useMemo(() => {
    if (typeof votingPower === "undefined") {
      return 0;
    }

    const totalStaked = parseFloat(formatUnits(votingPower.reignStaked));

    const percentage = (totalStaked / DAO_THRESHOLD[chainId]) * 100;

    if (percentage > 100) {
      return 100;
    }

    return percentage;
  }, [votingPower, chainId]);

  const fmTotal = useFormattedBigNumber(votingPower?.reignStaked, 0);
  const depositInput = useInput();
  return (
    <>
      <Panel className="my-3">
        <div className="flex justify-between mb-5">
          <Link href="/vote">
            <div className="flex items-center cursor-pointer">
              <ArrowLeft size={20} />
              <p>All Proposals</p>
            </div>
          </Link>

          <div className="cursor-pointer flex space-x-2 px-3 py-2 uppercase text-green-400 bg-primary-400 ring-1 ring-inset ring-green-600 ring-opacity-10 text-sm rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20">
            Executed
          </div>
        </div>

        <p className="font-medium text-2xl mb-5 text-white">
          Upgrade Governance Contract to Compound`s Governor Bravo
        </p>

        <p className="font-medium text-xl mb-1 text-gray-400">
          Voting ended August 26, 2021, 5:02 PM EDT
        </p>

        <div className="flex gap-3">
          <Panel className="flex-1 bg-gray-700">
            <div className="flex flex-1 justify-between mb-3">
              <p className="text-white">For</p>
              <p className="text-white">63,461,682</p>
            </div>
            <div className="w-full bg-green-500 h-1"></div>
          </Panel>

          <Panel className="flex-1 bg-gray-700">
            <div className="flex flex-1 justify-between mb-3">
              <p className="text-white">Against</p>
              <p className="text-white">2,304</p>
            </div>
            <div className="w-full bg-red-500 h-1"></div>
          </Panel>
        </div>

        <p className="text-2xl text-white my-5">Details</p>
        <p className="text-xl text-gray-200">
          1:
          Timelock.setPendingAdmin(0x408ED6354d4973f66138C91495F2f2FCbd8724C3)
        </p>
        <p className="text-xl text-gray-200">
          2: 0x408ED6354d4973f66138C91495F2f2FCbd8724C3._initiate(8)
        </p>

        <p className="text-2xl text-white my-5">Description</p>
        <p className="text-4xl text-white my-5">
          Upgrade Governance Contract to Compound`s Governor Bravo
        </p>
        <p className="text-base text-white my-5">
          Co-written with Getty Hill (@Getty), Eddy Lee (@elee), Yuan Han Li
          (@yuan-han-li), John Wang (@johnwang), and Ali Khambati (@alikhambati)
          Governor Alpha, the current governance contract used, was a great
          start, but in light of Compound`s and other protocols upgrade to
          Governor Bravo, Uniswap should migrate given Bravo`s additional safety
          benefits and upgradability. Native upgradeability: Under Governor
          Alpha, changes to governance parameters require deploying a new
          contract and completely migrating to a new address. This is
          particularly damaging to governance participation as it introduces
          downtime and asynchronicity. Many governance tools and custodians use
          factory contracts which point to a specific contract address, meaning
          parties must manually upgrade their infrastructure every time
          governance parameters are changed under Governor Alpha. This includes
          tools for creating autonomous proposals like fish.vote ; front-ends
          such as Tally , Sybil, and Boardroom which aggregate and display
          governance results for various protocols; and professional custodians
          which are used by large token holders, delegates, and community
          members. Enabling a static contract address that has proxy
          upgradability patterns is paramount for maximizing participation, and
          maintaining an open and secure governance process. Voting reason
          string: Governor Bravo gives voters the opportunity to add free-form
          comments (text strings) along with their on-chain votes. Not only does
          this increase the transparency around the rationale people have behind
          their votes, but it also facilitates more in-depth and nuanced
          discussion. New `abstain` voting option: Governor Bravo enables voters
          to formally abstain rather than forcing them to choose between voting
          yes/no or not voting at all. This will give voters more flexibility
          and also increase transparency into delegate behavior. Proposal
          numbers won`t reset: Under Governor Alpha, any upgrades to the
          contract resets the proposal number schema. Notice that `Proposal 0.4`
          (which resulted in deployment and migration to a new Governor Alpha
          contract due to modifying the proposal submission threshold parameter)
          caused the following on-chain proposal from @HarvardLawBFI to be
          numbered `Proposal 1.1` . Under Governor Bravo, this would not be an
          issue and proposal numbers would be continuous because the contract
          would be maintained at a single address. Proposal Cancellation: Bravo
          allows user-directed cancellations enabling erroneous proposals to be
          canceled if need be (rather than forcing people to vote no/abstain).
          Review Period: Governor Bravo allows governance to include a
          review/analysis period. Currently, Compound uses a 13140 block
          (~2-day) review period that allows holders to review the proposal.
          This means that users will have 2-days to prepare for voting (e.g.,
          remove UNI from Aave), unlike Governor Alpha which instantly snapshots
          users` voting power. A review period substantially improves the
          accessibility and safety of the governance process.
        </p>

        <p className="text-2xl text-white my-5">Proposer</p>
        <p className="flex space-x-2 text-red-500 w-full">
          0x9B68c14e936104e9a7a24c712BEecdc220002984
        </p>
      </Panel>
    </>
  );
}
