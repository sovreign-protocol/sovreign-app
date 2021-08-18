import { SupportedChainId } from "./chains";

export type FarmingPool = {
  address: string;
  name: string;
  pairs: string[];
  link: string;
};

export const FARMING_LP_SYMBOL = {
  [SupportedChainId.MAINNET]: "SLP",
  [SupportedChainId.RINKEBY]: "UNI-V2",
};

export const LP_FARMING_POOLS: Record<SupportedChainId, FarmingPool[]> = {
  [SupportedChainId.MAINNET]: [
    {
      address: "0x9B98Ff54446C7Ccf3118f980B5F32520d7Fa5207",
      name: "SushiSwap SOV/USDC LP",
      pairs: ["SOV", "USDC"],
      link: "https://app.sushi.com/add/0x0aFEE744B6d9fF2B78f76Fe10b3E0199C413Fd34/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      address: "0xa2DB17E3510dC323952Aa9a3A7ee7E2567d0096D",
      name: "SushiSwap REIGN/ETH LP",
      pairs: ["REIGN", "ETH"],
      link: "https://app.sushi.com/add/0xF34c55B03e4BD6C541786743E9C67ef1abd9EC67/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  ],
  [SupportedChainId.RINKEBY]: [
    {
      address: "0xd2805867258db181b608dbc757a1ce363b71c45f",
      name: "Uniswap SOV/USDC LP",
      pairs: ["SOV", "USDC"],
      link: "https://app.uniswap.org/#/add/v2/0xf65C93902eCC4c7979E92ED2cca01421e8021F77/0xe0dfbdbeb6d599b9142d84f76a6c4ff964f3949d",
    },
    {
      address: "0x1ef52788392d940a39d09ac26cfe3c3a6f6fae47",
      name: "Uniswap REIGN/ETH LP",
      pairs: ["REIGN", "ETH"],
      link: "https://app.uniswap.org/#/add/v2/0xf65c93902ecc4c7979e92ed2cca01421e8021f77/0x64f8b3b0a2a16a2bdfa30568cb769ed5ba760fba",
    },
  ],
};
