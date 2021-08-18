export const __DEV__ = process.env.NODE_ENV !== "production";

export const INFURA_ID = "TODO";

export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
}

export interface ChainInfo {
  explorer: string;
  label: string;
}

export const CHAIN_INFO: Record<SupportedChainId, ChainInfo> = {
  [SupportedChainId.MAINNET]: {
    explorer: "https://etherscan.io/",
    label: "Mainnet",
  },
  [SupportedChainId.RINKEBY]: {
    explorer: "https://rinkeby.etherscan.io/",
    label: "Rinkeby",
  },
};

type ContractNames =
  | "BasketBalancer"
  | "PoolRouter"
  | "WrappingRewards"
  | "ReignFacet"
  | "GovRewards"
  | "LPRewardsSOVUSDC"
  | "LPRewardsREIGNWETH"
  | "Staking"
  | "ReignDAO"
  | "SovWrapper";

type TokenNames = "SOV" | "REIGN";

export const CONTRACT_ADDRESSES: Record<
  ContractNames,
  Record<SupportedChainId, string>
> = {
  BasketBalancer: {
    [SupportedChainId.MAINNET]: "0x50ffbb955c6ac623a332bbb018f7fedd9952e930",
    [SupportedChainId.RINKEBY]: "0x349884021b0df3d50c07a08edbe171789fd3c8bb",
  },
  PoolRouter: {
    [SupportedChainId.MAINNET]: "0x1297c4a1f9ce8623aa357cd6dbe2fd2640a42b01",
    [SupportedChainId.RINKEBY]: "0xdd87fcefe89c598d835b412009f2f4f9209753cd",
  },
  WrappingRewards: {
    [SupportedChainId.MAINNET]: "0xda4df2fbd68987d510e4c397467c546393b1cc42",
    [SupportedChainId.RINKEBY]: "0x8635785602403fe2291127bf0a2f15f2b726ab9e",
  },
  ReignFacet: {
    [SupportedChainId.MAINNET]: "0x75664ea9d5975a0ac4f2300c93bb1377500a61de",
    [SupportedChainId.RINKEBY]: "0xc1660f2af8d7e6f20598e18c752a955b23cf564e",
  },
  GovRewards: {
    [SupportedChainId.MAINNET]: "0xA0aBcC88142C318232890dd2b6Da8C595ae87864",
    [SupportedChainId.RINKEBY]: "0x9a549a0704bae811128877d247812ede48095192",
  },
  LPRewardsREIGNWETH: {
    [SupportedChainId.MAINNET]: "0x53D51aEc756Be13F0C25583DF1918c931f56270c",
    [SupportedChainId.RINKEBY]: "0x4cdf326f0cecf20c1b759c60590839e92e1b4d29",
  },
  LPRewardsSOVUSDC: {
    [SupportedChainId.MAINNET]: "0xeB48efdAFcd9CE217a119FB888b560410a775564",
    [SupportedChainId.RINKEBY]: "0x04f47aa96c1f2018e7cd6df7b07b55d1c57cdaf4",
  },
  Staking: {
    [SupportedChainId.MAINNET]: "0x57e272adfb4941EE5f33738636121E45735400A4",
    [SupportedChainId.RINKEBY]: "0x5faf8c61a65670c9472e6ef909195a76104c6356",
  },
  ReignDAO: {
    [SupportedChainId.MAINNET]: "0x0bd5f7290eae951a13b935b4e7702dd05d50b813",
    [SupportedChainId.RINKEBY]: "0x78500ee25f607ffc906cccd27077f15f76c01785",
  },
  SovWrapper: {
    [SupportedChainId.MAINNET]: "0x320d1e4aeaf4416d3e390f0c9685534c2c29ae89",
    [SupportedChainId.RINKEBY]: "0xbfa9ea3b1556687df2e9965ffef84f28911f8a8f",
  },
};

export const TOKEN_ADDRESSES: Record<
  TokenNames,
  Record<SupportedChainId, string>
> = {
  SOV: {
    [SupportedChainId.MAINNET]: "0x0afee744b6d9ff2b78f76fe10b3e0199c413fd34",
    [SupportedChainId.RINKEBY]: "0xe0dfbdbeb6d599b9142d84f76a6c4ff964f3949d",
  },
  REIGN: {
    [SupportedChainId.MAINNET]: "0xf34c55b03e4bd6c541786743e9c67ef1abd9ec67",
    [SupportedChainId.RINKEBY]: "0x64f8b3b0a2a16a2bdfa30568cb769ed5ba760fba",
  },
};

export const POOL_ADDRESS: Record<SupportedChainId, string> = {
  [SupportedChainId.MAINNET]: "0x3029c3763d4b61b255b5eea5a506cb2f080487a7",
  [SupportedChainId.RINKEBY]: "0x1f4D666b204B0282fBe85EAb9231B13B50A03B91",
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

export const MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export const EPOCH_DURATION = 604800;

export const TOKEN_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
];

export type FarmingPool = {
  address: Record<SupportedChainId, string>;
  name: Record<SupportedChainId, string>;
  pairs: string[];
  link: Record<SupportedChainId, string>;
};

const LPRewardsREIGNWETHPool: FarmingPool = {
  address: {
    [SupportedChainId.MAINNET]: "0xa2DB17E3510dC323952Aa9a3A7ee7E2567d0096D",
    [SupportedChainId.RINKEBY]: "0x1ef52788392d940a39d09ac26cfe3c3a6f6fae47",
  },
  name: {
    [SupportedChainId.MAINNET]: "SushiSwap REIGN/ETH LP",
    [SupportedChainId.RINKEBY]: "Uniswap REIGN/ETH LP",
  },
  pairs: ["REIGN", "ETH"],
  link: {
    [SupportedChainId.MAINNET]:
      "https://app.sushi.com/add/0xF34c55B03e4BD6C541786743E9C67ef1abd9EC67/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    [SupportedChainId.RINKEBY]:
      "https://app.uniswap.org/#/add/v2/0xf65c93902ecc4c7979e92ed2cca01421e8021f77/0x64f8b3b0a2a16a2bdfa30568cb769ed5ba760fba",
  },
};

const LPRewardsSOVUSDCPool: FarmingPool = {
  address: {
    [SupportedChainId.MAINNET]: "0x9B98Ff54446C7Ccf3118f980B5F32520d7Fa5207",
    [SupportedChainId.RINKEBY]: "0xd2805867258db181b608dbc757a1ce363b71c45f",
  },
  name: {
    [SupportedChainId.MAINNET]: "SushiSwap SOV/USDC LP",
    [SupportedChainId.RINKEBY]: "Uniswap SOV/USDC LP",
  },
  pairs: ["SOV", "USDC"],
  link: {
    [SupportedChainId.MAINNET]:
      "https://app.sushi.com/add/0x0aFEE744B6d9fF2B78f76Fe10b3E0199C413Fd34/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    [SupportedChainId.RINKEBY]:
      "https://app.uniswap.org/#/add/v2/0xf65C93902eCC4c7979E92ED2cca01421e8021F77/0xe0dfbdbeb6d599b9142d84f76a6c4ff964f3949d",
  },
};

export const FARMING_POOLS: FarmingPool[] = [
  LPRewardsREIGNWETHPool,
  LPRewardsSOVUSDCPool,
];

export const LP_SYMBOL = {
  [SupportedChainId.MAINNET]: "SLP",
  [SupportedChainId.RINKEBY]: "UNI-V2",
};

export const MIN_INPUT_VALUE = 0.00000000000000001;

/**
 * @name EPOCH_REWARDS
 * @note Will be this value for the next two years as of August 16, 2021
 */
export const EPOCH_REWARDS = 2403846.153;

/**
 * @name LP_EPOCH_REWARDS
 * @note Will be this value for the next two years as of August 16, 2021
 */
export const LP_EPOCH_REWARDS = 96153.84;

export const DAO_THRESHOLD = {
  [SupportedChainId.MAINNET]: 15_000_000,
  [SupportedChainId.RINKEBY]: 4_000_000,
};
