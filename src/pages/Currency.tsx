import { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../services/currencyApi';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';

const Currency = () => {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState<{ amount: number; converted: number; rate: number; time: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const convert = async () => {
    if (amount <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchExchangeRates(from);
      if (data.result !== 'success') throw new Error('Ошибка API');
      const rate = data.conversion_rates[to];
      if (rate === undefined) throw new Error(`Курс для ${to} не найден`);
      const converted = amount * rate;
      setResult({
        amount,
        converted,
        rate,
        time: new Date(data.time_last_update_utc).toLocaleString('ru-RU'),
      });
    } catch (err: any) {
      setError(err.message || 'Не удалось конвертировать');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    convert();
  }, []);

  useEffect(() => {
    if (result) convert();
  }, [from, to]);

  return (
    <main className="container">
      <h2>Конвертер валют</h2>
      <div className="currency-converter">
        <div className="converter-box">
          <label htmlFor="amount">Сумма:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="converter-row">
          <div className="converter-box">
            <label htmlFor="fromCurrency">Из валюты:</label>
            <select id="fromCurrency" value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="USD">USD - Доллар США</option>
              <option value="EUR">EUR - Евро</option>
              <option value="RUB">RUB - Российский рубль</option>
              <option value="GBP">GBP - Фунт стерлингов</option>
              <option value="JPY">JPY - Японская иена</option>
              <option value="CNY">CNY - Китайский юань</option>
            </select>
          </div>
          <div className="converter-box">
            <label htmlFor="toCurrency">В валюту:</label>
            <select id="toCurrency" value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="USD">USD - Доллар США</option>
              <option value="EUR">EUR - Евро</option>
              <option value="RUB">RUB - Российский рубль</option>
              <option value="GBP">GBP - Фунт стерлингов</option>
              <option value="JPY">JPY - Японская иена</option>
              <option value="CNY">CNY - Китайский юань</option>
            </select>
          </div>
        </div>

        <button className="convert-btn" onClick={convert}>
          Конвертировать
        </button>

        {loading && <Loading />}
        {error && <ErrorDisplay message={error} />}

        {result && (
          <div className="currency-result">
            <div className="result-amount">
              {result.amount} {from} = {result.converted.toFixed(2)} {to}
            </div>
            <div className="exchange-rate">
              Курс: 1 {from} = {result.rate.toFixed(4)} {to}
            </div>
            <div className="last-update">Обновлено: {result.time}</div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Currency;