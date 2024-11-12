"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [connect, setConnect] = useState(false);
  const [balance, setBalance] = useState("");

  const failure = "Please Install the MetaMask & connect your MetaMask";
  const Success = "Your Account Successfully Conencted to MetaMask";

  const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_API_KEY;
  const provider = new ethers.JsonRpcProvider(
    `${process.env.NEXT_PUBLIC_INFURA_FETCH_KEY}`
  );

  const checkIfWalletConnected = async () => {
    if (!window.ethereum) return;

    const account = await window.ethereum.request({ method: "eth_accounts" });
    // console.log(account);
    if (account.length) {
      setCurrentAccount(account[0]);
    } else {
      console.log("Fail");
    }
    const address = "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97";
    const balance = await provider.getBalance(address);
    const showBalance = `${ethers.formatEther(balance)} ETH`;
    setBalance(showBalance);
    console.log(showBalance);
  };

  const cWallet = async () => {
    if (!window.ethereum) return console.log(failure);

    const accounts = await window.ethereum.request({
      mehtod: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  useEffect(() => {
    checkIfWalletConnected();
  });

  return (
    <div>
      <h1>Hello</h1>
      {currentAccount ? (
        <div>
          <p>Connected Account: {currentAccount}</p>
          <p>ETH Balance: {balance}</p>
        </div>
      ) : (
        <p>{failure}</p>
      )}
    </div>
  );
}