let tokenClient;
let gisInited = false;
const CLIENT_ID = '608313032359-fk4tde0vqc6rkgght4m2cg0n5gk6mqja.apps.googleusercontent.com'; // Replace with your actual Client ID
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: onTokenReceived, // Callback function to handle the token response
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gisInited) {
        document.getElementById('filterBtn').disabled = false;
    }
}

function onTokenReceived(response) {
    if (response.error !== undefined) {
        alert('Error during authentication: ' + response.error);
        return;
    }
    const accessToken = response.access_token;
    fetchSheetData(accessToken);
}

function fetchSheetData(accessToken) {
    const sheetId = '1ym-RXBCwYhZcABTx4_7eNxTxVahUaXZJO9LLx7zQv_o'; // Replace with your actual Sheet ID
    const baseApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?ranges=Sheet1&access_token=${accessToken}`;

    fetch(baseApiUrl)
        .then(response => response.json())
        .then(data => {
            const rows = data.valueRanges[0].values;
            const filters = {
                size: document.getElementById('size').value,
                resolution: document.getElementById('resolution').value,
                refreshRate: document.getElementById('refreshRate').value,
            };
            filterAndDisplayMonitors(rows, filters);
        }).catch(error => {
            console.error('Error fetching data: ', error);
        });
}

function filterAndDisplayMonitors(rows, filters) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results
    rows.shift(); // Remove header row
    rows.forEach(row => {
        const [name, size, resolution, refreshRate, link] = row;
        if (
            (filters.size && size !== filters.size) ||
            (filters.resolution && resolution !== filters.resolution) ||
            (filters.refreshRate && refreshRate !== filters.refreshRate)
        ) {
            return; // Skip if any filter does not match
        }
        const monitorRow = document.createElement('div');
        monitorRow.classList.add('monitor-row');
        monitorRow.innerHTML = `
            <strong>${name}</strong> - ${size}", ${resolution}, ${refreshRate} <a href="${link}" target="_blank">Buy</a>
        `;
        resultsContainer.appendChild(monitorRow);
    });
}

document.getElementById('filterBtn').addEventListener('click', () => {
    if (!gisInited) {
        console.log("Google Identity Services not initialized.");
        return;
    }
    // Trigger the sign-in flow
    tokenClient.requestAccessToken({ prompt: '' });
});

window.onload = function() {
    gisLoaded();
};
