"use client";

import { WalletId, NetworkId, WalletManager } from "@txnlab/use-wallet";
import { WalletProvider as UseWalletProvider } from "@txnlab/use-wallet-react";

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
  ],
  network: NetworkId.TESTNET,
  options: {
    appId: 1234, // just generic mock to satisfy typescript if it expects something
  }
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <UseWalletProvider manager={walletManager}>
      {children}
    </UseWalletProvider>
  );
}
