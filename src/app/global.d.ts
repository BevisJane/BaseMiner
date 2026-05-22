import type { EIP1193Provider } from "viem";

declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      isCoinbaseWallet?: true;
      isMetaMask?: true;
      isOkxWallet?: true;
      isOKExWallet?: true;
    };
  }
}

export {};
