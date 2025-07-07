const stocksData = [
  { name: "Reliance", price: 2800 },
  { name: "TCS", price: 3700 },
  { name: "Infosys", price: 1450 },
  { name: "HDFC Bank", price: 1650 },
  { name: "ITC", price: 480 },
  { name: "Adani Ports", price: 980 }
];

const portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];

function renderStocks() {
  const stockDiv = document.getElementById("stocks");
  stocksData.forEach((stock, index) => {
    const el = document.createElement("div");
    el.className = "stock";
    el.innerHTML = `
      <strong>${stock.name}</strong> - ₹${stock.price}
      <br>
      <button onclick="buyStock(${index})">🛒 BUY</button>
    `;
    stockDiv.appendChild(el);
  });
}

function buyStock(index) {
  const stock = stocksData[index];
  portfolio.push({ ...stock, date: new Date().toLocaleString() });
  localStorage.setItem("portfolio", JSON.stringify(portfolio));
  renderPortfolio();
}

function renderPortfolio() {
  const ul = document.getElementById("portfolio");
  ul.innerHTML = "";
  portfolio.forEach(item => {
    const li = document.createElement("li");
    li.className = "portfolio-item";
    li.textContent = `${item.name} - ₹${item.price} [${item.date}]`;
    ul.appendChild(li);
  });
}

function exportPortfolio() {
  let csv = "Stock,Price,Date\\n";
  portfolio.forEach(item => {
    csv += `${item.name},${item.price},${item.date}\\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "portfolio.csv";
  a.click();
}

function resetPortfolio() {
  localStorage.removeItem("portfolio");
  location.reload();
}

renderStocks();
renderPortfolio();
