// "use client";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [connect, setConnect] = useState(false);
  const [balance, setBalance] = useState('');

  const failure = "Please Install the MetaMask & connect your MetaMask";
  const Success = "Your Account Successfully Conencted to MetaMask";

  return <>Hello</>;
}
