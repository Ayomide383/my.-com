const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";

document.addEventListener("DOMContentLoaded", () => {
  const fromCurrency = document.getElementById("from-currency");
  const toCurrency = document.getElementById("to-currency");
  const fromSearch = document.getElementById("from-currency-search");
  const toSearch = document.getElementById("to-currency-search");
  const amountInput = document.getElementById("amount");
  const convertButton = document.getElementById("convert");
  const swapButton = document.getElementById("swap");
  const resultDiv = document.getElementById("result");

  // Fetch currency data
  let currencies = [];
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      currencies = Object.keys(data.rates);
      populateDropdown(fromCurrency, currencies);
      populateDropdown(toCurrency, currencies);
    })
    .catch((error) => {
      console.error("Error fetching exchange rates:", error);
    });

  // Populate dropdown
  function populateDropdown(dropdown, options) {
    dropdown.innerHTML = "";
    options.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency;
      option.textContent = currency;
      dropdown.appendChild(option);
    });
  }

  // Search filter function
  function filterDropdown(input, dropdown) {
    const searchTerm = input.value.toLowerCase();
    const filteredCurrencies = currencies.filter((currency) =>
      currency.toLowerCase().includes(searchTerm)
    );
    populateDropdown(dropdown, filteredCurrencies);
  }

  // Event listeners for search
  fromSearch.addEventListener("input", () => filterDropdown(fromSearch, fromCurrency));
  toSearch.addEventListener("input", () => filterDropdown(toSearch, toCurrency));

  // Convert currency
  convertButton.addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || !from || !to) {
      resultDiv.innerText = "Please fill in all fields!";
      return;
    }

    fetch(`${API_URL}`)
      .then((response) => response.json())
      .then((data) => {
        const rate = data.rates[to] / data.rates[from];
        const convertedAmount = (amount * rate).toFixed(2);
        resultDiv.innerText = `${amount} ${from} = ${convertedAmount} ${to}`;
      })
      .catch((error) => {
        console.error("Error converting currency:", error);
        resultDiv.innerText = "Conversion failed. Try again!";
      });
  });

  // Swap currencies
  swapButton.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    resultDiv.innerText = ""; // Clear previous result
  });
});