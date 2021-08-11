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
  | "LPRewardsREIGNWETH";

type TokenNames = "SOV" | "REIGN";

export const CONTRACT_ADDRESSES: Record<
  ContractNames,
  Record<SupportedChainId, string>
> = {
  BasketBalancer: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0x349884021b0df3d50c07a08edbe171789fd3c8bb",
  },
  PoolRouter: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0xdd87fcefe89c598d835b412009f2f4f9209753cd",
  },
  WrappingRewards: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0x855dD13AbAb0e891952Fd973634cefBb1c5AAbAC",
  },
  ReignFacet: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0xc1660f2af8d7e6f20598e18c752a955b23cf564e",
  },
  GovRewards: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0x9a549A0704Bae811128877d247812EDE48095192",
  },
  LPRewardsREIGNWETH: {
    [SupportedChainId.MAINNET]: "TOOD",
    [SupportedChainId.RINKEBY]: "0x4cdf326f0cecf20c1b759c60590839e92e1b4d29",
  },
  LPRewardsSOVUSDC: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0x04f47aa96c1f2018e7cd6df7b07b55d1c57cdaf4",
  },
};

export const TOKEN_ADDRESSES: Record<
  TokenNames,
  Record<SupportedChainId, string>
> = {
  SOV: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0xe0dfbdbeb6d599b9142d84f76a6c4ff964f3949d",
  },
  REIGN: {
    [SupportedChainId.MAINNET]: "TODO",
    [SupportedChainId.RINKEBY]: "0x64f8b3b0a2a16a2bdfa30568cb769ed5ba760fba",
  },
};

export const POOL_ADDRESS: Record<SupportedChainId, string> = {
  [SupportedChainId.MAINNET]: "TODO",
  [SupportedChainId.RINKEBY]: "0x9E850E0E1cdD1b452A694D27eB82Fa78F502C8C7",
};

export const TOKEN_NAMES_BY_ADDRESS: Record<string, string> = {
  "0x712863c3ad98ef4319133b8646d51383700cb37b": "sCHF",
  "0xf65c93902ecc4c7979e92ed2cca01421e8021f77": "sBTC",
  "0x3a85973fd194c9fb966882fee7b11481c38344fb": "sXAU",
};

export const MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export const EPOCH_DURATION = 604800;
