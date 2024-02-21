const API_KEY = 'AIzaSyAKf8WzsQxw1Vnnr9eRBisCKbSkOtmUm04'; // Replace with your actual API Key
const SHEET_ID = '1ym-RXBCwYhZcABTx4_7eNxTxVahUaXZJO9LLx7zQv_o'; // Replace with your actual Google Sheet ID
const RANGE = 'Sheet1'; // Adjust based on your actual range
let sheetData = []; // To store the fetched data

document.addEventListener('DOMContentLoaded', () => {
    fetchSheetData(); // Fetch data when the page loads
});

document.getElementById('filterBtn').addEventListener('click', () => {
    const filters = {
        size: document.getElementById('size').value,
        resolution: document.getElementById('resolution').value,
        refreshRate: document.getElementById('refreshRate').value,
    };
    filterAndDisplayMonitors(sheetData, filters); // Filter based on input
});

function fetchSheetData() {
    const baseApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(baseApiUrl)
        .then(response => response.json())
        .then(data => {
            sheetData = data.values; // Store fetched data
            filterAndDisplayMonitors(sheetData, {}); // Display all data initially
        }).catch(error => {
            console.error('Error fetching data: ', error);
        });
}

function filterAndDisplayMonitors(rows, filters) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results
    rows.shift(); // Remove header row, if it hasn't been removed already

    rows.forEach(row => {
        // Assuming the order is: Name, Size, Resolution, Refresh Rate, Link
        const [name, size, resolution, refreshRate, link] = row;
        if (
            (filters.size && size !== filters.size) ||
            (filters.resolution && resolution !== filters.resolution) ||
            (filters.refreshRate && refreshRate !== filters.refreshRate)
        ) {
            return; // Skip if any filter does not match
        }
        const monitorRow = document.createElement('div');
        monitorRow.innerHTML = `
            <strong>${name}</strong> - ${size}", ${resolution}, ${refreshRate} <a href="${link}" target="_blank">Buy</a>
        `;
        resultsContainer.appendChild(monitorRow);
    });
}