import { CONTRACT_ADDRESSES } from "@/constants";
import useContract from "./useContract";
import BasketBalancer from "@/contracts/BasketBalancer.json";

export default function useBasketBalancer() {
  return useContract(CONTRACT_ADDRESSES.BasketBalancer[4], BasketBalancer);
}
