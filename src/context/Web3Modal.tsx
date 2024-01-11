"use client"

import { useAppDispatch } from '@/lib/hooks';
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount } from '@web3modal/ethers/react'
import React from 'react';

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!!

// 2. Set chains
export const networkParams = {
    avalanche : {
      chainId: 43114,
      rpcUrl: "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc",
      name: "Avalanche Mainnet",
      currency: 'AVAX',
      explorerUrl: "https://snowtrace.io",
    },
    fuji: {
      chainId: 43113,
      rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
      name: "Avalanche FUJI C-Chain",
      currency: "AVAX",
      explorerUrl: "https://testnet.snowtrace.io/",
    }
};
  

// 3. Create modal
const metadata = {
  name: 'Lazy Bear River',
  description: 'Stake your bear on the river to compete for the tasty reward of FISH. Will you be able to work together to solve the population problem, or face the perils of greed?',
  url: 'https://lazybearriver.com',
  icons: ['/icon.png']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [networkParams.avalanche, networkParams.fuji],
  projectId
})

export default function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const account = useWeb3ModalAccount();

  // Dispatch action when account changes
  React.useEffect(() => {
      if (account) {
          dispatch({type: 'UPDATE_ACCOUNT', payload: account});
      }
  }, [account, dispatch]);
  
  return children;
}