import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import type { Dispatch, SetStateAction } from "react";
import { ChevronDown } from "react-feather";

export type Token = {
  symbol: string;
  address: string;
};

type TokenSelectProps = {
  value: Token;
  onChange: Dispatch<
    SetStateAction<{
      symbol: string;
      address: string;
    }>
  >;
  tokens: Token[];
};

export default function TokenSelect({
  value,
  onChange,
  tokens,
}: TokenSelectProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={classNames(
            "relative py-2 pr-10 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 flex items-center space-x-2",
            value ? "bg-primary pl-2" : "bg-white text-primary pl-4"
          )}
        >
          {value && (
            <img
              alt={value?.symbol}
              className="rounded-full bg-primary"
              decoding="async"
              height={24}
              loading="lazy"
              src={`https://raw.githubusercontent.com/Synthetixio/synthetix-assets/v2.0.10/synths/${value?.symbol}.svg`}
              width={24}
            />
          )}

          <span className="block truncate font-medium">
            {value ? value.symbol : "Select a token"}
          </span>

          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown size={20} aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute w-full max-h-60 mt-2 overflow-auto bg-primary-300 ring-1 ring-inset ring-white ring-opacity-20 rounded-lg focus:outline-none p-1">
          {tokens?.map((token, tokenIndex) => (
            <Listbox.Option
              key={tokenIndex}
              className={({ active }) =>
                classNames(
                  "cursor-default select-none relative p-2 rounded-md text-white",
                  active ? "bg-white/[0.10]" : ""
                )
              }
              value={token}
              disabled={token === value}
            >
              {({ selected }) => (
                <div
                  className={classNames(
                    "flex justify-between",
                    selected ? "opacity-50" : ""
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      alt={token.symbol}
                      className="rounded-full bg-primary"
                      decoding="async"
                      height={20}
                      loading="lazy"
                      src={`https://raw.githubusercontent.com/Synthetixio/synthetix-assets/v2.0.10/synths/${token.symbol}.svg`}
                      width={20}
                    />

                    <span
                      className={classNames(
                        selected ? "font-medium" : "font-normal",
                        "block truncate leading-5"
                      )}
                    >
                      {token.symbol}
                    </span>
                  </div>

                  {/* Add In Showing Balances Later */}
                  {/* <span className="font-mono font-medium leading-5">{"0"}</span> */}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

export function TokenSingle({ symbol }: { symbol: string }) {
  return (
    <div className="relative inline-flex py-2 pl-2 pr-3 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 items-center space-x-2 bg-primary">
      <img
        alt={symbol}
        className="rounded-full"
        height={24}
        src={`/tokens/${symbol}.png`}
        width={24}
      />

      <span className="block truncate font-medium">{symbol}</span>
    </div>
  );
}

export function TokenPair({
  pairs,
  symbol,
}: {
  pairs: string[];
  symbol: string;
}) {
  return (
    <div className="relative inline-flex py-2 pl-2 pr-3 text-left rounded-xl cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 items-center space-x-2 bg-primary">
      <div className="flex -space-x-2">
        {!!pairs ? (
          pairs?.map((pair, pairIndex) => (
            <div className="relative" key={pairIndex}>
              <div className="absolute ring-1 ring-inset ring-white ring-opacity-20 rounded-full inset-0" />

              <img
                width={24}
                height={24}
                className="rounded-full"
                src={`/tokens/${pair}.png`}
                alt={pair}
              />
            </div>
          ))
        ) : (
          <>
            <div className="ring-1 ring-inset ring-white ring-opacity-20 rounded-full w-6 h-6 bg-primary-400" />
            <div className="ring-1 ring-inset ring-white ring-opacity-20 rounded-full w-6 h-6 bg-primary-400" />
          </>
        )}
      </div>

      <span className="block truncate font-medium">{symbol}</span>
    </div>
  );
}
