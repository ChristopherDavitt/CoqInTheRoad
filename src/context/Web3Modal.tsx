"use client"

import { coqInTheRoadABI, erc20ABI } from '@/abis';
import { useAppDispatch } from '@/lib/hooks';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { ethers } from 'ethers';
import React from 'react';

export default function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const account = useWeb3ModalAccount();


  const getAllowanceAndBalance = async () => {
    if (window.ethereum && account.address && account.chainId === process.env.NEXT_PUBLIC_CHAIN_ID) {
      try {
        // Connect to an Ethereum provider (e.g., Infura, Alchemy, MetaMask)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_COQ_CA!!, erc20ABI, provider);
        contract.allowance(account.address, process.env.NEXT_PUBLIC_GAME_CA!!)
          .then((data: any) => dispatch({ type: 'UPDATE_ALLOWANCE', payload: ethers.utils.formatEther(data) }) )
        ;
        contract.balanceOf(account.address)
          .then((data: any) =>  dispatch({ type: 'UPDATE_BALANCE', payload: ethers.utils.formatEther(data) }))
        contract.balanceOf(process.env.NEXT_PUBLIC_GAME_CA!!)
          .then((data: any) => dispatch({ type: 'UPDATE_TREASURY', payload: ethers.utils.formatEther(data) }) )
        ;
      ;
      } catch (error) {
        console.error('Error Getting Allowance:', error);
        throw error;
      }
    }
  }

  const getMinBet = async () => {
    if (window.ethereum && account.address && account.chainId === process.env.NEXT_PUBLIC_CHAIN_ID) {
      try {
        // Connect to an Ethereum provider (e.g., Infura, Alchemy, MetaMask)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GAME_CA!!, coqInTheRoadABI, provider);
        contract.minBet()
          .then((data: any) => dispatch({ type: 'UPDATE_MIN_BET', payload: ethers.utils.formatEther(data) }) )
        ;
      ;
      } catch (error) {
        console.error('Error Getting Min Bet:', error);
        throw error;
      }
    }
  }


  // Dispatch action when account changes
  React.useEffect(() => {
    // The "any" network will allow spontaneous network changes
    if (window.ethereum) {

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider.on("network", (newNetwork, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
          window.location.reload();
        }
      });
      if (account.chainId !== process.env.NEXT_PUBLIC_CHAIN_ID) {
        try {
          // check if the chain to connect to is installed
          window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            // chainId must be in hexadecimal numbers
            params: [{ chainId:  `0x${Number(process.env.NEXT_PUBLIC_CHAIN_ID!!).toString(16)}` }],
          });
        } catch (error: any) {
          // This error code indicates that the chain has not been added to MetaMask
          // if it is not, then install it into the user MetaMask
          if (error.code === 4902) {
            try {
              window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xA86A',
                    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
            }
          }
          console.error(error);
        }
      } else if (account && account.chainId === process.env.NEXT_PUBLIC_CHAIN_ID) {
        dispatch({type: 'UPDATE_ACCOUNT', payload: account});
        getAllowanceAndBalance();
        getMinBet();
      }
      fetch(`https://api.traderjoexyz.com/priceusd/0x420fca0121dc28039145009570975747295f2329`)
        .then((data) => data.json())
        .then((res) =>  dispatch({ payload: res, type: 'UPDATE_COQ_PRICE'}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    fetch(`https://api.traderjoexyz.com/priceusd/0x420fca0121dc28039145009570975747295f2329`)
        .then((data) => data.json())
        .then((res) =>  dispatch({ payload: res, type: 'UPDATE_COQ_PRICE'}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
      
  return children;
}