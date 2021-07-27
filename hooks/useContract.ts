import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import type { ContractInterface } from "@ethersproject/contracts";
import { useMemo } from "react";
import useWeb3Store from "../useWeb3Store";

export default function useContract(address: string, ABI: ContractInterface) {
  const account = useWeb3Store((state) => state.account);
  const library = useWeb3Store((state) => state.library);

  return useMemo(
    () =>
      isAddress(address) && !!ABI && !!library
        ? new Contract(address, ABI, library.getSigner(account))
        : undefined,
    [address, ABI, library, account]
  );
}
