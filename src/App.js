import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveView from './components/LiveView';
import { ethers } from "ethers";
import { Network, Alchemy } from "alchemy-sdk";
import Table from './components/Table';

const settings = {
  apiKey: "Tj8ielOXj0p9G4QIndE8",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
const provider = new ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/Tj8ielOXj0p9G4QIndE8");



function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [etherPrice, setEtherPrice] = useState();
  const [marketCap, setMarketCap] = useState();
  const [transactionsCount, setTransactionsCount] = useState();
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    async function fetchBlocks() {
      setLoading(true);

      const latest = await provider.getBlockNumber();
      console.log('Latest block number:', latest);

      const N = 5;
      const blockNumbers = Array.from(
        { length: N },
        (_, i) => latest - i
      );

      const blocksData = await Promise.all(
        blockNumbers.map((number) =>
          provider.getBlock(number)
        )
      );

      setBlocks(blocksData);
      setLoading(false);
      console.log(blocks);
    }

    async function getEtherPrice() {
      try {
        const price = await alchemy.core.getEtherPrice();
        setEtherPrice(price);
      } catch (error) {
        console.error('Error fetching ether price:', error);
      }
    }

    async function getMarketCap() {
      try {
        const cap = await alchemy.core.getMarketCapitalization();
        setMarketCap(cap);
      } catch (error) {
        console.error('Error fetching market cap:', error);
      }
    }

    async function getTransactionsCount() {
      try {
        const count = await alchemy.core.getTransactionCount();
        setTransactionsCount(count);
      } catch (error) {
        console.error('Error fetching transactions count:', error);
      }
    }

    fetchBlocks();
    Promise.all([getEtherPrice(), getMarketCap(), getTransactionsCount()])
      .then(() => setLoading(false))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <LiveView etherPrice={etherPrice} marketCap={marketCap} transactions={transactionsCount} loading={loading} />
      <Table data={blocks.map((block) => ({
        k1: block.number,
        k2: block.miner,
        k3: block.transactions.length
      }))} />
      <div className="App">Block Number: {blockNumber}</div>
    </>
  )
}

export default App;
