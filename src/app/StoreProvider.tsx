'use client'
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import React from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5';
// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!!

// 2. Set chains
export const networkParams = {
    avalanche : {
      chainId: 43114,
      rpcUrl: "https://avalanche-mainnet.infura.io/v3/e3d31f07ae9b498aa779479bf1560fde",
      name: "Avalanche Mainnet",
      currency: 'AVAX',
      explorerUrl: "https://snowtrace.io",
    },
    fuji: {
      chainId: 43113,
      rpcUrl: "https://avalanche-fuji.infura.io/v3/e3d31f07ae9b498aa779479bf1560fde",
      name: "Avalanche FUJI C-Chain",
      currency: "AVAX",
      explorerUrl: "https://testnet.snowtrace.io/",
    }
};

// 3. Create modal
const metadata = {
  name: 'COQ In The Road',
  description: 'What happened when the COQ crossed the road???',
  url: 'https://coqintheroad.com',
  icons: ['/icon.png']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [networkParams.avalanche, networkParams.fuji],
  projectId
});

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>();
  
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}