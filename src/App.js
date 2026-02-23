import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveView from './components/LiveView';
import { ethers } from "ethers";
import Table from './components/Table';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
// const settings = {
//   apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
//   network: Network.ETH_MAINNET,
// };


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface

const provider = new ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/Tj8ielOXj0p9oG4QIndE8");

// const provider = new AlchemyProvider('mainnet', 'your-api-key');



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

    fetchBlocks();
  }, []);

  // useEffect(() => {
  // async function getEtherPrice() {
  //   const price = await alchemy.core.getEtherPrice();
  //   setEtherPrice(price);
  // }
  //
  // async function getMarketCap() {
  //   const cap = await alchemy.core.getMarketCapitalization();
  //   setMarketCap(cap);
  // }
  //
  // async function getTransactionsCount() {
  //   const count = await alchemy.core.getTransactionCount();
  //   setTransactionsCount(count);
  // }

  //   Promise.all([getEtherPrice(), getMarketCap(), getTransactionsCount()])
  //     .then(() => setLoading(false))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

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
