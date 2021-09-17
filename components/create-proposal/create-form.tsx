import { DAO_THRESHOLD } from "@/constants/numbers";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useWeb3Store from "@/hooks/useWeb3Store";
import useVotingPower from "@/hooks/view/useVotingPower";
import { commify, formatUnits } from "@ethersproject/units";
import { useMemo, useState, Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Panel from "../panel";
import NumericalInput from "../numericalInput";
import TokenSelect, { Token } from "../tokenSelect";
import useGetPoolTokens from "@/hooks/view/useGetPoolTokens";
import useInput from "@/hooks/useInput";
import { ArrowLeft, ChevronDown } from "react-feather";
import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";

const actions = [{ name: "Transfer Token" }, { name: "Approve Token" }];

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

  const [selected, setSelected] = useState(actions[0]);
  return (
    <>
      <Panel className="my-3">
        <div className="flex items-center mb-5">
          <Link href="/vote">
            <div className="cursor-pointer">
              <ArrowLeft size={20} />
            </div>
          </Link>

          <div className="cursor-pointer mx-auto flex space-x-2 px-3 py-2 text-xl text-white">
            Create Proposal
          </div>
        </div>

        <Panel className="my-3">
          <p className="text-base text-white">Proposed Action</p>
          <div className="flex space-x-4 mb-2">
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative w-full mt-1">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left text-xl rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                  <span className="block truncate text-xl">
                    {selected.name}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown
                      className="w-5 h-5 text-gray-200"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-primary-300 ring-1 ring-inset ring-white ring-opacity-20 rounded-lg  shadow-lg max-h-60  focus:outline-none sm:text-sm">
                    {actions.map((person, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          classNames(
                            "cursor-default select-none p-2 rounded text-white",
                            active ? "bg-white/[0.10]" : ""
                          )
                        }
                        value={person}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {person.name}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </Panel>

        <Panel className="bg-red-100">
          <div className="space-y-4">
            <div>
              <p className="font-medium leading-5 mb-1 text-red-500">
                Tip: Select an action and describe your proposal for the
                community. The proposal cannot be modified after submission, so
                please verify all information before submitting. The voting
                period will begin immediately and last for 7 days. To propose a
                custom action, read the docs.
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="my-3">
          <div className="flex space-x-4 mb-2">
            <TokenSelect
              value={depositToken}
              onChange={depositTokenSet}
              tokens={poolTokens}
              order="DESC"
            />

            <div className="flex-1">
              <label className="sr-only" htmlFor="depositAmount">
                Enter amount of token
              </label>

              <NumericalInput
                name="depositAmount"
                id="depositAmount"
                required
                {...depositInput.valueBind}
              />
            </div>
          </div>
        </Panel>

        <Panel className="my-3">
          <p className="text-base text-white">To</p>
          <div className="flex space-x-4 mb-2">
            <input
              placeholder="Wallet Address or ENS name"
              className="appearance-none bg-transparent text-2xl font-normal font-mono w-full h-10 focus:outline-none"
            />
          </div>
        </Panel>

        <Panel className="my-3">
          <p className="text-base text-white">Proposal</p>
          <input
            placeholder="Proposal Title"
            className="mb-2 appearance-none bg-transparent text-2xl font-normal font-mono w-full h-10 focus:outline-none border-b border-white "
          />
          <textarea
            // cols="40"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="
            ## Summary
            Insert your summary here
            ## Methodology
            Insert your methodology here
            ## Conclusion
            Insert your conclusion here
            "
            className="appearance-none bg-transparent text-base font-normal font-mono w-full focus:outline-none h-96"
          />
        </Panel>
        <div className="cursor-pointer flex px-3 py-3 justify-center text-white bg-red-400 ring-1 ring-inset ring-red-400 ring-opacity-10 text-base rounded-xl focus:outline-none focus-visible:ring-opacity-20 hover:ring-opacity-20 w-full">
          You must have 2,500,000 votes to submit a proposal
        </div>
        <div className="flex space-x-2 px-3 py-3 justify-center text-white w-full">
          Don’t have 2.5M votes? Anyone can create an autonomous proposal using
          fish.vote
        </div>
      </Panel>
    </>
  );
}
