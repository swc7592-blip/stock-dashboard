import { Bitcoin, TrendingUp, Wallet } from 'lucide-react';
import miningHoldings from '../data/mining-holdings.json';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bitcoin className="w-8 h-8 text-orange-500" />
          Mining Company Treasury Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Track Bitcoin & Ethereum holdings from major mining companies</p>
      </header>

      {/* Content */}
      <div className="container mx-auto p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bitcoin Holdings</p>
                <p className="text-3xl font-bold mt-1">
                  {(miningHoldings.microstrategy.bitcoin.current + miningHoldings.bitmine.bitcoin).toLocaleString()} BTC
                </p>
              </div>
              <Bitcoin className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Ethereum Holdings</p>
                <p className="text-3xl font-bold mt-1">
                  {miningHoldings.bitmine.ethereum.current.toLocaleString()} ETH
                </p>
              </div>
              <Wallet className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Companies Tracked</p>
                <p className="text-3xl font-bold mt-1">2</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* MicroStrategy Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{miningHoldings.microstrategy.name}</h2>
              <p className="text-gray-400">Symbol: {miningHoldings.microstrategy.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="font-semibold">{miningHoldings.microstrategy.bitcoin.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Bitcoin Holdings</p>
                <p className="text-4xl font-bold text-orange-400 mt-1">
                  {miningHoldings.microstrategy.bitcoin.current.toLocaleString()} BTC
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {miningHoldings.microstrategy.bitcoin.percentageOfSupply}% of total supply
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Data Sources</p>
                <a
                  href={miningHoldings.microstrategy.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm mt-1 block"
                >
                  Official Website →
                </a>
                <a
                  href={miningHoldings.microstrategy.dataSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  Bitbo Treasury →
                </a>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-4">Bitcoin Holdings History</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {miningHoldings.microstrategy.history.slice(-10).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{entry.date}</span>
                    <span className="font-semibold text-orange-400">
                      {entry.bitcoin.toLocaleString()} BTC
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BitMine Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{miningHoldings.bitmine.name}</h2>
              <p className="text-gray-400">Symbol: {miningHoldings.bitmine.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="font-semibold">{miningHoldings.bitmine.ethereum.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Bitcoin</p>
              <p className="text-3xl font-bold text-orange-400 mt-1">
                {miningHoldings.bitmine.bitcoin} BTC
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Ethereum</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">
                {miningHoldings.bitmine.ethereum.current.toLocaleString()} ETH
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Treasury Value</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                ${(miningHoldings.bitmine.totalValue / 1000000000).toFixed(2)}B
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <a
              href={miningHoldings.bitmine.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              Official Website →
            </a>
            <a
              href={miningHoldings.bitmine.dataSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              CoinGecko Treasury →
            </a>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Company</th>
                  <th className="text-right py-3 px-4">Bitcoin</th>
                  <th className="text-right py-3 px-4">Ethereum</th>
                  <th className="text-right py-3 px-4">Primary Asset</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3 px-4 font-semibold">MicroStrategy</td>
                  <td className="text-right py-3 px-4 text-orange-400">
                    {miningHoldings.microstrategy.bitcoin.current.toLocaleString()} BTC
                  </td>
                  <td className="text-right py-3 px-4 text-gray-500">-</td>
                  <td className="text-right py-3 px-4">
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                      Bitcoin
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">BitMine Immersion</td>
                  <td className="text-right py-3 px-4 text-orange-400">
                    {miningHoldings.bitmine.bitcoin} BTC
                  </td>
                  <td className="text-right py-3 px-4 text-purple-400">
                    {miningHoldings.bitmine.ethereum.current.toLocaleString()} ETH
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                      Ethereum
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
