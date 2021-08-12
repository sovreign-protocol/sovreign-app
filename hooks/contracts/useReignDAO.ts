import { CONTRACT_ADDRESSES } from "@/constants";
import ReignDAO from "@/contracts/ReignDAO.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useReignDAO() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.ReignDAO[chainId], ReignDAO);
}
