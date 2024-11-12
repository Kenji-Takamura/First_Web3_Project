"use client";

import { ethers } from "ethers";
import { useState } from "react";
declare global {
  interface Window {
    ethereum?: never;
  }
}

export default function Home() {
  const [address, setAddress] = useState<string | null>("");
  const connectWallet = async () => {
    let signer = null;

    let provider;

    if (window.ethereum == null) {
      console.log("No metamask wallet installed!");
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      signer.getAddress().then((a) => setAddress(a));
    }
  };

  return (
    <>
      <div>
        <h1> Demo Metamask connection</h1>
        <button
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          onClick={connectWallet}
        >
          {" "}
          Connect wallet
        </button>
        <h2>Address : {address}</h2>
      </div>
    </>
  );
}
