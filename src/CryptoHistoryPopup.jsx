import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function CryptoHistoryPopup({ cryptoId, onClose }) {
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`, {
        params: { vs_currency: "usd", days: 3 },
      })
      .then((response) => {
        setHistoryData(response.data.prices);
      });
  }, [cryptoId]);

  if (!historyData) return null;

  const chartData = {
    labels: historyData.map((data) => new Date(data[0]).toLocaleDateString()),
    datasets: [
      {
        label: "Precio (USD)",
        data: historyData.map((data) => data[1]),
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div className="popup">
      <button className="close-btn" onClick={onClose}>X</button>
      <Line data={chartData} />
    </div>
  );
}

export default CryptoHistoryPopup;
