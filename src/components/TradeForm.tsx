import React, { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const TradeForm: React.FC = () => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('45000'); // Default BTC price
  const [crypto, setCrypto] = useState<'btc' | 'eth'>('btc');
  const [error, setError] = useState('');
  const updateBalance = useAuthStore(state => state.updateBalance);
  const user = useAuthStore(state => state.user);
  const { theme } = useThemeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const numAmount = parseFloat(amount);
      const numPrice = parseFloat(price);

      if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (isNaN(numPrice) || numPrice <= 0) {
        setError('Please enter a valid price');
        return;
      }

      updateBalance(tradeType, numAmount, numPrice, crypto);
      setAmount(''); // Reset form after successful trade
      
      // Show success message
      setError(`Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${numAmount} ${crypto.toUpperCase()}`);
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Trade failed. Please try again.');
      }
    }
  };

  const maxAmount = () => {
    if (tradeType === 'buy') {
      const maxBuy = user ? user.balance.usd / parseFloat(price) : 0;
      setAmount(maxBuy.toFixed(8));
    } else {
      const maxSell = user ? user.balance[crypto] : 0;
      setAmount(maxSell.toString());
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Place Order
        </h2>
        <button
          onClick={() => setTradeType(tradeType === 'buy' ? 'sell' : 'buy')}
          className={`p-2 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <ArrowDownUp className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className={`p-3 rounded-lg text-sm ${
            error.startsWith('Successfully') 
              ? 'bg-blue-500/10 text-blue-500' 
              : 'bg-red-500/10 text-red-500'
          }`}>
            {error}
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Cryptocurrency
          </label>
          <select
            value={crypto}
            onChange={(e) => {
              setCrypto(e.target.value as 'btc' | 'eth');
              setPrice(e.target.value === 'btc' ? '45000' : '3000');
            }}
            className={`w-full rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:border-blue-500 focus:ring-blue-500`}
          >
            <option value="btc">Bitcoin (BTC)</option>
            <option value="eth">Ethereum (ETH)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Amount ({crypto.toUpperCase()})
            </label>
            <button
              type="button"
              onClick={maxAmount}
              className="text-xs text-blue-500 hover:text-blue-400"
            >
              Max
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:border-blue-500 focus:ring-blue-500`}
            placeholder="0.00"
            step="0.00000001"
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Price (USD)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:border-blue-500 focus:ring-blue-500`}
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Total: ${((parseFloat(amount) || 0) * (parseFloat(price) || 0)).toFixed(2)}
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            tradeType === 'buy'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {tradeType === 'buy' ? 'Buy' : 'Sell'} {crypto.toUpperCase()}
        </button>
      </form>
    </div>
  );
};

export default TradeForm;