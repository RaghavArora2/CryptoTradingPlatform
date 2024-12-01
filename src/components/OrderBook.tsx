import React from 'react';
import { OrderBook as OrderBookType, OrderBookEntry } from '../types/crypto';
import useThemeStore from '../store/themeStore';

interface OrderBookProps {
  orderBook: OrderBookType;
}

const OrderBookRow: React.FC<{ entry: OrderBookEntry; type: 'bid' | 'ask' }> = ({
  entry,
  type,
}) => {
  const { theme } = useThemeStore();
  
  return (
    <div className={`grid grid-cols-2 py-1 text-sm ${
      type === 'bid' 
        ? 'text-green-500' 
        : 'text-red-500'
    }`}>
      <span className="text-right pr-4">{entry.price.toFixed(2)}</span>
      <span className="text-right">{entry.amount.toFixed(4)}</span>
    </div>
  );
};

const OrderBook: React.FC<OrderBookProps> = ({ orderBook }) => {
  const { theme } = useThemeStore();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4`}>
      <h2 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Order Book
      </h2>
      <div className={`grid grid-cols-2 text-sm font-medium mb-2 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <span className="text-right pr-4">Price (USD)</span>
        <span className="text-right">Amount (BTC)</span>
      </div>
      <div className="space-y-1">
        {orderBook.asks.slice(0, 10).map((ask, i) => (
          <OrderBookRow key={`ask-${i}`} entry={ask} type="ask" />
        ))}
        <div className={`border-t border-b my-2 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`} />
        {orderBook.bids.slice(0, 10).map((bid, i) => (
          <OrderBookRow key={`bid-${i}`} entry={bid} type="bid" />
        ))}
      </div>
    </div>
  );
};

export default OrderBook;