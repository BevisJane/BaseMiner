"use client";

import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { BUILDER_CODE_SUFFIX } from "./constants";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({ target: "coinbaseWallet", shimDisconnect: true }),
    injected({ target: "metaMask", shimDisconnect: true }),
    injected({ target: "okxWallet", shimDisconnect: true }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: "BaseMiner",
      appLogoUrl: "/icon.svg",
    }),
  ],
  multiInjectedProviderDiscovery: true,
  ssr: true,
  transports: {
    [base.id]: http(),
  },
  dataSuffix: BUILDER_CODE_SUFFIX,
});
