'use client';
import { useState } from 'react';
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { rpc, TransactionBuilder, Networks, Contract, TimeoutInfinite } from '@stellar/stellar-sdk';

const CONTRACT_ID = 'CBUZHV5NKXY2MMWY5OWTWWDXVK3JOWR5SKZIAYSY52P3DMVAA4PMJLRD';
const RPC_URL = 'https://soroban-testnet.stellar.org';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      let checkConnection = await isConnected();
      const isExtConnected = typeof checkConnection === 'object' ? checkConnection.isConnected : checkConnection;

      if (isExtConnected) {
        const access = await requestAccess();
        if (access.address) setWalletAddress(access.address);
      } else {
        alert('Tolong install Freighter Wallet extension dulu ya!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleSmartContractAction = async (functionName: string) => {
    if (!walletAddress) {
      alert('Connect wallet Freighter dulu bos!');
      return;
    }
    
    setIsLoading(true);
    try {
      const server = new rpc.Server(RPC_URL);
      const account = await server.getAccount(walletAddress);
      const contract = new Contract(CONTRACT_ID);

      const tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(contract.call(functionName))
      .setTimeout(TimeoutInfinite)
      .build();

      const preparedTx = await server.prepareTransaction(tx);
      const signedXdr = await signTransaction(preparedTx.toXDR(), { networkPassphrase: Networks.TESTNET });
      
      if (signedXdr) {
        alert(`🔥 Transaksi ${functionName} berhasil di-sign oleh Freighter! Demo Hackathon Aman!`);
      }
    } catch (error) {
      console.error(`Action ${functionName} gagal:`, error);
      alert('Transaksi dibatalkan atau terjadi error.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    // Background utama yang menawan dengan soft mesh gradient
    <main className="relative min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans overflow-hidden">
      
      {/* Abstract Background Blobs untuk nge-highlight efek Glassmorphism */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-2000"></div>

      {/* Glassmorphism Container Utama */}
      <div className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-white/40 border border-white/60 shadow-2xl rounded-3xl p-8 space-y-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-center border-b border-white/30 pb-5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 drop-shadow-sm">ReKampus Escrow</h1>
          <button
            onClick={connectWallet}
            className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-all shadow-md hover:shadow-lg backdrop-blur-md"
          >
            {walletAddress ? `Connected: ${formatAddress(walletAddress)}` : 'Connect Freighter'}
          </button>
        </header>

        {/* Escrow Detail Panel (Inner Glass Card) */}
        <section className="backdrop-blur-md bg-white/50 border border-white/50 rounded-2xl p-6 shadow-inner">
          <h2 className="text-xl font-semibold mb-5 text-slate-800">Active Transaction</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-white/40 pb-3">
              <span className="text-slate-600 font-medium">Status</span>
              <span className="font-bold text-indigo-600 tracking-wide">Initialized</span>
            </div>
            <div className="flex justify-between border-b border-white/40 pb-3">
              <span className="text-slate-600 font-medium">Amount</span>
              <span className="font-bold text-slate-800">500 XLM</span>
            </div>
            <div className="flex justify-between border-white/40 pb-1">
              <span className="text-slate-600 font-medium">Seller Address</span>
              <span className="font-mono text-xs font-semibold text-slate-700 bg-white/40 px-2 py-1 rounded-md">
                GBRA...Z6A4
              </span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => handleSmartContractAction('deposit')}
            disabled={isLoading}
            className="py-3 backdrop-blur-sm bg-white/60 border border-white/70 rounded-xl text-sm font-bold text-slate-700 hover:bg-white/80 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
          <button 
            onClick={() => handleSmartContractAction('confirm_received')}
            disabled={isLoading}
            className="py-3 bg-indigo-600/90 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 backdrop-blur-md"
          >
            Confirm Received
          </button>
          <button 
            onClick={() => handleSmartContractAction('cancel')}
            disabled={isLoading}
            className="py-3 backdrop-blur-sm bg-red-50/60 border border-red-200/60 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100/80 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            Cancel
          </button>
        </section>

      </div>
    </main>
  );
}