import { DAO_THRESHOLD } from "@/constants/numbers";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useVotingPower from "@/hooks/view/useVotingPower";
import { commify, formatUnits } from "@ethersproject/units";
import { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Panel from "../panel";

export default function DAOProgress() {
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: votingPower } = useVotingPower();

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

  return (
    <>
      <Panel>
        <div className="space-y-4">
          <div>
            <p className="font-medium leading-5 mb-1">Sovreign Governance</p>
            <p className="font-medium leading-5 mb-1">
              UNI tokens represent voting shares in Uniswap governance. You can
              vote on each proposal yourself or delegate your votes to a third
              party.
            </p>
          </div>
        </div>
      </Panel>

      <div className="flex justify-between items-center my-5">
        <p className="font-medium text-2xl">Proposals</p>
        <Link href="/create-proposal">
          <div className="cursor-pointer flex space-x-2 px-3 py-3 bg-primary-400 ring-1 ring-inset ring-white ring-opacity-10 text-base rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20">
            Create Proposal
          </div>
        </Link>
      </div>

      <Panel className="my-3">
        <div className="flex flex-row items-center">
          <span className="font-medium text-lg mr-4">0.4</span>
          <span className="font-medium text-lg flex-1">
            Retroactive Proxy Contract Airdrop
          </span>
          <Link href="/vote/1">
            <div className="cursor-pointer flex space-x-2 px-3 py-3 uppercase text-green-400 bg-primary-400 ring-1 ring-inset ring-green-400 ring-opacity-10 text-base rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20">
              Executed
            </div>
          </Link>
        </div>
      </Panel>
      <Panel className="my-3">
        <div className="flex flex-row items-center">
          <span className="font-medium text-lg mr-4">0.3</span>
          <span className="font-medium text-lg flex-1">
            Retroactive Proxy Contract Airdrop
          </span>
          <div className="cursor-pointer flex space-x-2 px-3 py-3 uppercase text-gray-400 bg-primary-400 ring-1 ring-inset ring-green-400 ring-opacity-10 text-base rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20">
            Cancelled
          </div>
        </div>
      </Panel>
      <Panel className="my-3">
        <div className="flex flex-row items-center">
          <span className="font-medium text-lg mr-4">0.2</span>
          <span className="font-medium text-lg flex-1">
            Retroactive Proxy Contract Airdrop
          </span>
          <div className="cursor-pointer flex space-x-2 px-3 py-3 uppercase text-red-400 bg-primary-400 ring-1 ring-inset ring-green-400 ring-opacity-10 text-base rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20">
            Defeated
          </div>
        </div>
      </Panel>
      <Panel className="my-3">
        <div className="flex flex-row items-center">
          <span className="font-medium text-lg mr-4">0.1</span>
          <span className="font-medium text-lg flex-1">
            Retroactive Proxy Contract Airdrop
          </span>
          <div className="cursor-pointer flex space-x-2 px-3 py-3 uppercase text-red-400 bg-primary-400 ring-1 ring-inset ring-green-400 ring-opacity-10 text-base rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20">
            Defeated
          </div>
        </div>
      </Panel>
    </>
  );
}
