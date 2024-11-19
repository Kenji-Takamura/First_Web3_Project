"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setAccount(accounts[0]);
        setBalance(ethers.formatEther(balance));
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="p-8 max-w-md w-full bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">
          MetaMask Wallet Connection
        </h1>
        <div className="flex justify-center mb-8">
          <img src="hero-avatar.jpeg" style={{ width: "200px" }} className="rounded-lg self-center" alt="file-pic" />
        </div>

        <button
          onClick={connectWallet}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium mb-6 transition-all duration-200
            ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Connecting...
            </div>
          ) : (
            "Connect Wallet"
          )}
        </button>

        {account && (
          <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address</label>
              <p className="text-sm break-all font-mono">{account}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Balance</label>
              <p className="text-lg font-semibold">{balance} ETH</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}