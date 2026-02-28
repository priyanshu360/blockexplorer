import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveView from './components/LiveView';
import { ethers } from "ethers";
import Table from './components/Table';
import Modal from './components/Modal';
import { getEtherPrice, getBlocks, getBlock, getTransaction, getBalance, getTransactionCount, getRecentTransactions } from './services/api';

const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`);



function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [etherPrice, setEtherPrice] = useState();
  const [transactionsCount, setTransactionsCount] = useState();
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [addressTxs, setAddressTxs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      console.log('Fetching data...');

      try {
        console.log('Fetching blocks...');
        const blocksData = await getBlocks(provider, 100);
        console.log('Blocks:', blocksData);
        setBlocks(blocksData);

        console.log('Fetching ether price...');
        const etherPrice = await getEtherPrice();
        console.log('Ether price:', etherPrice);
        setEtherPrice(etherPrice);

        console.log('Fetching block number...');
        const blockNumber = await provider.getBlockNumber();
        console.log('Block number:', blockNumber);
        setTransactionsCount(blockNumber);

        console.log('Fetching recent transactions...');
        const txs = await getRecentTransactions(provider, 100);
        const formattedTxs = txs.map(tx => ({
          ...tx,
          value: ethers.formatEther(tx.value)
        }));
        console.log('Recent transactions:', formattedTxs);
        setRecentTransactions(formattedTxs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const refreshBlocks = async () => {
    try {
      const [blocksData, txs] = await Promise.all([
        getBlocks(provider, 100),
        getRecentTransactions(provider, 100)
      ]);
      setBlocks(blocksData);
      const formattedTxs = txs.map(tx => ({
        ...tx,
        value: ethers.formatEther(tx.value)
      }));
      setRecentTransactions(formattedTxs);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing blocks:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshBlocks, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const trimmed = query.trim();

      if (/^\d+$/.test(trimmed)) {
        const block = await getBlock(provider, parseInt(trimmed));
        if (block) {
          setSearchResult({ type: 'block', data: block });
        } else {
          setSearchError('Block not found');
        }
      } else if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
        const balance = await getBalance(provider, trimmed);
        const txCount = await getTransactionCount(provider, trimmed);
        setSearchResult({ type: 'address', data: { address: trimmed, balance: balance.toString(), txCount } });
      } else if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) {
        const tx = await getTransaction(provider, trimmed);
        if (tx) {
          setSearchResult({ type: 'transaction', data: tx });
        } else {
          setSearchError('Transaction not found');
        }
      } else {
        setSearchError('Invalid search format. Enter a block number, address (0x...), or transaction hash');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Error performing search');
    }

    setSearchLoading(false);
  };

  const viewBlock = async (blockNumber) => {
    setSearchLoading(true);
    try {
      const block = await getBlock(provider, blockNumber);
      if (block) {
        setSelectedBlock(block);
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error fetching block:', error);
    }
    setSearchLoading(false);
  };

  const clearSelection = () => {
    setSelectedBlock(null);
    setSelectedTransaction(null);
    setSelectedAddress(null);
    setSearchResult(null);
  };

  const viewTransaction = async (txHash) => {
    setSearchLoading(true);
    try {
      const tx = await getTransaction(provider, txHash);
      if (tx) {
        setSelectedTransaction(tx);
        setSelectedBlock(null);
        setSelectedAddress(null);
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
    }
    setSearchLoading(false);
  };

  const viewAddress = async (address) => {
    setSearchLoading(true);
    try {
      const balance = await getBalance(provider, address);
      const txCount = await getTransactionCount(provider, address);

      setSelectedAddress({ address, balance, txCount, history: [] });
      setSelectedBlock(null);
      setSelectedTransaction(null);
      setSearchResult(null);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
    setSearchLoading(false);
  };

  return (
    <>
      <Navbar />
      <Hero onSearch={handleSearch} />

      {searchLoading && <div className="text-center py-4">Searching...</div>}

      {searchError && (
        <div className="max-w-5xl mx-auto mt-8 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{searchError}</div>
        </div>
      )}

      {searchResult && (
        <section className="max-w-5xl mx-auto mt-8 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 capitalize">{searchResult.type} Result</h2>

            {searchResult.type === 'block' && (
              <div className="space-y-2">
                <p><span className="font-semibold">Block Number:</span> #{searchResult.data.number}</p>
                <p><span className="font-semibold">Hash:</span> <span className="font-mono text-sm">{searchResult.data.hash}</span></p>
                <p><span className="font-semibold">Miner:</span> <span className="font-mono text-sm">{searchResult.data.miner}</span></p>
                <p><span className="font-semibold">Timestamp:</span> {new Date(searchResult.data.timestamp * 1000).toLocaleString()}</p>
                <p><span className="font-semibold">Transactions:</span> {searchResult.data.transactions.length}</p>
                <p><span className="font-semibold">Gas Used:</span> {searchResult.data.gasUsed.toString()}</p>
              </div>
            )}

            {searchResult.type === 'address' && (
              <div className="space-y-2">
                <p><span className="font-semibold">Address:</span> <span className="font-mono text-sm">{searchResult.data.address}</span></p>
                <p><span className="font-semibold">Balance:</span> {ethers.formatEther(searchResult.data.balance)} ETH</p>
                <p><span className="font-semibold">Transaction Count:</span> {searchResult.data.txCount}</p>
              </div>
            )}

            {searchResult.type === 'transaction' && (
              <div className="space-y-2">
                <p><span className="font-semibold">Hash:</span> <span className="font-mono text-sm">{searchResult.data.hash}</span></p>
                <p><span className="font-semibold">From:</span> <span className="font-mono text-sm">{searchResult.data.from}</span></p>
                <p><span className="font-semibold">To:</span> <span className="font-mono text-sm">{searchResult.data.to}</span></p>
                <p><span className="font-semibold">Value:</span> {ethers.formatEther(searchResult.data.value)} ETH</p>
                <p><span className="font-semibold">Gas Price:</span> {ethers.formatUnits(searchResult.data.gasPrice, 'gwei')} Gwei</p>
                <p><span className="font-semibold">Block Number:</span> #{searchResult.data.blockNumber}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <Modal isOpen={!!selectedBlock} onClose={clearSelection} title={`Block #${selectedBlock?.number}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-600 text-sm">Hash</p>
            <p className="font-mono text-sm break-all">{selectedBlock?.hash}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Parent Hash</p>
            <p className="font-mono text-sm break-all">{selectedBlock?.parentHash}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Miner</p>
            <p className="font-mono text-sm break-all">{selectedBlock?.miner}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Timestamp</p>
            <p>{selectedBlock ? new Date(selectedBlock.timestamp * 1000).toLocaleString() : ''}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Gas Used</p>
            <p>{selectedBlock?.gasUsed?.toString()}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Gas Limit</p>
            <p>{selectedBlock?.gasLimit?.toString()}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Difficulty</p>
            <p>{selectedBlock?.difficulty?.toString()}</p>
          </div>
        </div>

        {selectedBlock?.transactions?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Transactions ({selectedBlock.transactions.length})</h3>
            <div className="max-h-60 overflow-y-auto border rounded">
              {selectedBlock.transactions.slice(0, 10).map((tx, i) => (
                <div
                  key={i}
                  onClick={() => viewTransaction(tx)}
                  className="p-2 border-b hover:bg-gray-50 cursor-pointer font-mono text-sm truncate"
                >
                  {tx}
                </div>
              ))}
              {selectedBlock.transactions.length > 10 && (
                <div className="p-2 text-gray-500 text-center">
                  +{selectedBlock.transactions.length - 10} more transactions
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!selectedTransaction} onClose={clearSelection} title="Transaction Details">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-600 text-sm">Hash</p>
            <p className="font-mono text-sm break-all">{selectedTransaction?.hash}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-600 text-sm">From</p>
              <p
                className="font-mono text-sm break-all text-indigo-600 cursor-pointer hover:underline"
                onClick={() => viewAddress(selectedTransaction?.from)}
              >
                {selectedTransaction?.from}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 text-sm">To</p>
              <p
                className="font-mono text-sm break-all text-indigo-600 cursor-pointer hover:underline"
                onClick={() => viewAddress(selectedTransaction?.to)}
              >
                {selectedTransaction?.to}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-600 text-sm">Value</p>
              <p>{selectedTransaction ? ethers.formatEther(selectedTransaction.value) : ''} ETH</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 text-sm">Gas Price</p>
              <p>{selectedTransaction ? ethers.formatUnits(selectedTransaction.gasPrice, 'gwei') : ''} Gwei</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-600 text-sm">Block Number</p>
              <p className="text-indigo-600 font-medium">#{selectedTransaction?.blockNumber}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 text-sm">Transaction Index</p>
              <p>{selectedTransaction?.index}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-600 text-sm">Gas Limit</p>
              <p>{selectedTransaction?.gasLimit?.toString()}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600 text-sm">Nonce</p>
              <p>{selectedTransaction?.nonce}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Input Data</p>
            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
              {selectedTransaction?.data === '0x' ? '(No data)' : selectedTransaction?.data}
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedAddress} onClose={clearSelection} title="Address Details">
        <div className="mb-6">
          <p className="font-semibold text-gray-600 text-sm">Address</p>
          <p className="font-mono text-sm break-all">{selectedAddress?.address}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold text-gray-600 text-sm">Balance</p>
            <p className="text-2xl font-bold">{selectedAddress ? ethers.formatEther(selectedAddress.balance) : ''} ETH</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 text-sm">Transaction Count</p>
            <p className="text-2xl font-bold">{selectedAddress?.txCount}</p>
          </div>
        </div>
      </Modal>

      <LiveView etherPrice={etherPrice} transactions={transactionsCount} loading={loading} />
      <section className="max-w-5xl mx-auto mt-12 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Blocks</h2>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={refreshBlocks}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Table data={blocks} onRowClick={viewBlock} type="blocks" itemsPerPage={10} />
          <Table data={recentTransactions} onRowClick={viewTransaction} type="transactions" itemsPerPage={10} />
        </div>
      </section>
    </>
  )
}

export default App;
