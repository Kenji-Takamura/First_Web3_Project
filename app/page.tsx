"use client";

import { ethers } from "ethers";
import { useEffect, useState, useCallback, useMemo } from "react";

// Proper TypeScript interface for Ethereum window object
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: string[] | Record<string, unknown>[]
      }) => Promise<string[] | Record<string, unknown>>;
      on: (event: string, callback: (params: string[] | Record<string, unknown>) => void) => void;
      removeListener: (event: string, callback: (params: string[] | Record<string, unknown>) => void) => void;
    };
  }
}

// Interface for wallet state
interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export default function Home() {
  // Single state object for better state management
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isLoading: false,
    error: null,
  });

  // Error handling utility
  const handleError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    setWalletState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    console.error("Wallet error:", error);
  }, []);

  // Wallet connection logic
  const updateWalletInfo = useCallback(async (provider: ethers.BrowserProvider) => {
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      setWalletState({
        address,
        balance: ethers.formatEther(balance),
        isConnected: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const connectWallet = useCallback(async () => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this application");
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      await updateWalletInfo(provider);
    } catch (error) {
      handleError(error);
    }
  }, [updateWalletInfo, handleError]);

  // Effect for wallet events
  useEffect(() => {
    const handleAccountsChanged = useMemo(() => {
      return (accounts: string[] | Record<string, unknown>) => {
        if (walletState.isConnected) {
          if (Array.isArray(accounts) && accounts.length === 0) {
            // Disconnect case
            setWalletState(prev => ({
              ...prev,
              address: null,
              balance: null,
              isConnected: false
            }));
          } else {
            connectWallet();
          }
        }
      };
    }, [walletState.isConnected, connectWallet]);

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (Array.isArray(accounts) && accounts.length > 0) {
            connectWallet();
          }
        })
        .catch(handleError);

      // Cleanup listeners
      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [walletState.isConnected, connectWallet, handleError]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Web3 Wallet Connection
        </h1>

        {walletState.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {walletState.error}
          </div>
        )}

        <button
          className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition-colors
            ${walletState.isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
          onClick={connectWallet}
          disabled={walletState.isLoading}
        >
          {walletState.isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Connecting...
            </span>
          ) : (
            "Connect Wallet"
          )}
        </button>

        {walletState.isConnected && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
            <div className="space-y-3">
              <p className="flex items-center">
                <span className="font-medium w-20">Address:</span>
                <span className="text-gray-600 break-all">
                  {walletState.address}
                </span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-20">Balance:</span>
                <span className="text-gray-600">
                  {walletState.balance} ETH
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}