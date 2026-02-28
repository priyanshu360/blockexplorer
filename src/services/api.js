export const getEtherPrice = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
  const data = await response.json();
  return data.ethereum.usd;
};

export const getBlocks = async (provider, count = 5) => {
  const latest = await provider.getBlockNumber();
  const blockNumbers = Array.from({ length: count }, (_, i) => latest - i);
  return Promise.all(blockNumbers.map((n) => provider.getBlock(n)));
};

export const getBlock = async (provider, blockNumber) => {
  return provider.getBlock(blockNumber);
};

export const getTransaction = async (provider, txHash) => {
  return provider.getTransaction(txHash);
};

export const getBalance = async (provider, address) => {
  return provider.getBalance(address);
};

export const getTransactionCount = async (provider, address) => {
  return provider.getTransactionCount(address);
};

export const getRecentTransactions = async (provider, count = 10) => {
  const latestBlock = await provider.getBlockNumber();
  const block = await provider.getBlock(latestBlock, true);
  const txHashes = block.transactions.slice(0, count);
  const txs = await Promise.all(txHashes.map(hash => provider.getTransaction(hash)));
  return txs.map(tx => ({
    ...tx,
    timestamp: block.timestamp
  }));
};
