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
    if (window.ethereum && account.address) {
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
    if (window.ethereum && account.address) {
      try {
        // Connect to an Ethereum provider (e.g., Infura, Alchemy, MetaMask)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GAME_CA!!, coqInTheRoadABI, provider);
        contract.treasuryBalance()
          .then((data: any) => dispatch({ type: 'UPDATE_TREASURY', payload: data }) )
        ;
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
    if (account) {
      dispatch({type: 'UPDATE_ACCOUNT', payload: account});
    }
    fetch(`https://api.traderjoexyz.com/priceusd/0x420fca0121dc28039145009570975747295f2329`)
      .then((data) => data.json())
      .then((res) =>  dispatch({ payload: res, type: 'UPDATE_COQ_PRICE'}));
    getAllowanceAndBalance();
    getMinBet();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
      
  return children;
}