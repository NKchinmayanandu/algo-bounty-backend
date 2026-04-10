"use client";

import { WalletId, NetworkId, WalletManager, WalletProvider as UseWalletProvider } from "@txnlab/use-wallet-react";

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
  ],
  network: NetworkId.TESTNET
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <UseWalletProvider manager={walletManager}>
      {children}
    </UseWalletProvider>
  );
}
