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
