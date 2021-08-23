import { SupportedChainId } from "./chains";

export enum TokenNames {
  SOV = "SOV",
  REIGN = "REIGN",
}

type AddressMap = Record<SupportedChainId, string>;

type TokenAddresses = Record<TokenNames, AddressMap>;

export const TOKEN_ADDRESSES: TokenAddresses = {
  [TokenNames.SOV]: {
    [SupportedChainId.MAINNET]: "0x0afee744b6d9ff2b78f76fe10b3e0199c413fd34",
    [SupportedChainId.RINKEBY]: "0xe0dfbdbeb6d599b9142d84f76a6c4ff964f3949d",
  },
  [TokenNames.REIGN]: {
    [SupportedChainId.MAINNET]: "0x17f59dd7fefc2f276509eed2ad6b65271458177e",
    [SupportedChainId.RINKEBY]: "0x64f8b3b0a2a16a2bdfa30568cb769ed5ba760fba",
  },
};

export const TOKEN_NAMES_BY_ADDRESS: Record<string, string> = {
  "0x712863c3ad98ef4319133b8646d51383700cb37b": "sCHF",
  "0x0f83287ff768d1c1e17a42f44d644d7f22e8ee1d": "sCHF",
  "0xf65c93902ecc4c7979e92ed2cca01421e8021f77": "sBTC",
  "0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6": "sBTC",
  "0x3a85973fd194c9fb966882fee7b11481c38344fb": "sXAU",
  "0x261efcdd24cea98652b9700800a13dfbca4103ff": "sXAU",
  "0x57ab1ec28d129707052df4df418d58a2d46d5f51": "sUSD",
  "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb": "sETH",
  "0x6a22e5e94388464181578aa7a6b869e00fe27846": "sXAG",
};

export const TOKEN_CATEGORY_BY_SYMBOL: Record<
  string,
  "CURRENCY" | "CRYPTO" | "COMMODITY"
> = {
  sCHF: "CURRENCY",
  sUSD: "CURRENCY",
  sBTC: "CRYPTO",
  sETH: "CRYPTO",
  sXAU: "COMMODITY",
  sXAG: "COMMODITY",
};

export const TOKEN_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
];

export type Token = {
  address: string;
  decimals: number;
  symbol: string;
};

export const TOKEN_ASSETS: Record<
  TokenNames,
  Record<SupportedChainId, Token>
> = {
  [TokenNames.REIGN]: {
    [SupportedChainId.MAINNET]: {
      address: TOKEN_ADDRESSES[TokenNames.REIGN][SupportedChainId.MAINNET],
      decimals: 18,
      symbol: TokenNames.REIGN,
    },
    [SupportedChainId.RINKEBY]: {
      address: TOKEN_ADDRESSES[TokenNames.REIGN][SupportedChainId.RINKEBY],
      decimals: 18,
      symbol: TokenNames.REIGN,
    },
  },
  [TokenNames.SOV]: {
    [SupportedChainId.MAINNET]: {
      address: TOKEN_ADDRESSES[TokenNames.SOV][SupportedChainId.MAINNET],
      decimals: 18,
      symbol: TokenNames.SOV,
    },
    [SupportedChainId.RINKEBY]: {
      address: TOKEN_ADDRESSES[TokenNames.SOV][SupportedChainId.RINKEBY],
      decimals: 18,
      symbol: TokenNames.SOV,
    },
  },
};

export const SUSHI_SWAP_LINKS: Record<TokenNames, string> = {
  [TokenNames.SOV]:
    "https://app.sushi.com/swap?outputCurrency=0x0aFEE744B6d9fF2B78f76Fe10b3E0199C413Fd34",
  [TokenNames.REIGN]:
    "https://app.sushi.com/swap?outputCurrency=0x17F59DD7fEfC2F276509EeD2Ad6B65271458177E",
};
