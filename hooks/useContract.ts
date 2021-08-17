import ERC20_ABI from "@/contracts/ERC20.json";
import type { ERC20 } from "@/contracts/types";
import { Contract } from "@ethersproject/contracts";
import { useMemo } from "react";
import useWeb3Store from "./useWeb3Store";

export default function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any
): T | null {
  const chainId = useWeb3Store((state) => state.chainId);
  const account = useWeb3Store((state) => state.account);
  const library = useWeb3Store((state) => state.library);

  return useMemo(() => {
    if (!address || !ABI || !library || !chainId) {
      return null;
    }

    try {
      return new Contract(address, ABI, library.getSigner(account));
    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [address, ABI, library, account]) as T;
}

export function useTokenContract(tokenAddress?: string) {
  return useContract<ERC20>(tokenAddress, ERC20_ABI);
}
