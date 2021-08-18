import { SupportedChainId } from "./chains";

export enum ContractNames {
  BASKET_BALANCER = "BasketBalancer",
  POOL_ROUTER = "PoolRouter",
  WRAPPING_REWARDS = "WrappingRewards",
  REIGN_FACET = "ReignFacet",
  GOV_REWARDS = "GovRewards",
  LP_REWARDS_SOV_USDC = "LPRewardsSOVUSDC",
  LP_REWARDS_REIGN_WETH = "LPRewardsREIGNWETH",
  STAKING = "Staking",
  REIGN_DAO = "ReignDAO",
  SOV_WRAPPER = "SovWrapper",
}

type AddressMap = Record<SupportedChainId, string>;

type ContractAddresses = Record<ContractNames, AddressMap>;

export const CONTRACT_ADDRESSES: ContractAddresses = {
  [ContractNames.BASKET_BALANCER]: {
    [SupportedChainId.MAINNET]: "0x50ffbb955c6ac623a332bbb018f7fedd9952e930",
    [SupportedChainId.RINKEBY]: "0x349884021b0df3d50c07a08edbe171789fd3c8bb",
  },
  [ContractNames.POOL_ROUTER]: {
    [SupportedChainId.MAINNET]: "0x1297c4a1f9ce8623aa357cd6dbe2fd2640a42b01",
    [SupportedChainId.RINKEBY]: "0xdd87fcefe89c598d835b412009f2f4f9209753cd",
  },
  [ContractNames.WRAPPING_REWARDS]: {
    [SupportedChainId.MAINNET]: "0xda4df2fbd68987d510e4c397467c546393b1cc42",
    [SupportedChainId.RINKEBY]: "0x8635785602403fe2291127bf0a2f15f2b726ab9e",
  },
  [ContractNames.REIGN_FACET]: {
    [SupportedChainId.MAINNET]: "0x43fad3bd3fae2b445bcfd0d20acadc24ba12aec0",
    [SupportedChainId.RINKEBY]: "0xc1660f2af8d7e6f20598e18c752a955b23cf564e",
  },
  [ContractNames.GOV_REWARDS]: {
    [SupportedChainId.MAINNET]: "0xA0aBcC88142C318232890dd2b6Da8C595ae87864",
    [SupportedChainId.RINKEBY]: "0x9a549a0704bae811128877d247812ede48095192",
  },
  [ContractNames.LP_REWARDS_REIGN_WETH]: {
    [SupportedChainId.MAINNET]: "0x53D51aEc756Be13F0C25583DF1918c931f56270c",
    [SupportedChainId.RINKEBY]: "0x4cdf326f0cecf20c1b759c60590839e92e1b4d29",
  },
  [ContractNames.LP_REWARDS_SOV_USDC]: {
    [SupportedChainId.MAINNET]: "0xeB48efdAFcd9CE217a119FB888b560410a775564",
    [SupportedChainId.RINKEBY]: "0x04f47aa96c1f2018e7cd6df7b07b55d1c57cdaf4",
  },
  [ContractNames.STAKING]: {
    [SupportedChainId.MAINNET]: "0x57e272adfb4941EE5f33738636121E45735400A4",
    [SupportedChainId.RINKEBY]: "0x5faf8c61a65670c9472e6ef909195a76104c6356",
  },
  [ContractNames.REIGN_DAO]: {
    [SupportedChainId.MAINNET]: "0x0bd5f7290eae951a13b935b4e7702dd05d50b813",
    [SupportedChainId.RINKEBY]: "0x78500ee25f607ffc906cccd27077f15f76c01785",
  },
  [ContractNames.SOV_WRAPPER]: {
    [SupportedChainId.MAINNET]: "0x320d1e4aeaf4416d3e390f0c9685534c2c29ae89",
    [SupportedChainId.RINKEBY]: "0xbfa9ea3b1556687df2e9965ffef84f28911f8a8f",
  },
};
