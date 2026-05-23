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
      // Menggunakan rpc.Server sesuai versi SDK terbaru
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

      // Menggunakan networkPassphrase sesuai aturan Freighter API terbaru
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
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">ReKampus Escrow</h1>
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            {walletAddress ? `Connected: ${formatAddress(walletAddress)}` : 'Connect Freighter'}
          </button>
        </header>

        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Active Transaction</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-blue-600">Initialized</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium">500 XLM</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Seller Address</span>
              <span className="font-mono text-xs text-gray-600">GBRA6BIBSH7C6SVQ7X7ONJINMLHJOTUP65EJ3QXSBVEUUNRMF3L3Z6A4</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => handleSmartContractAction('deposit')}
            disabled={isLoading}
            className="py-2.5 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
          <button 
            onClick={() => handleSmartContractAction('confirm_received')}
            disabled={isLoading}
            className="py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Confirm Received
          </button>
          <button 
            onClick={() => handleSmartContractAction('cancel')}
            disabled={isLoading}
            className="py-2.5 border border-red-200 bg-white text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </section>

      </div>
    </main>
  );
}