// Test Google Sheets API directly
// Direct configuration instead of loading config.js
const config = {
    apiKey: 'AIzaSyAcStfXXwdeh2d_MyFOorLzOcvplHAWjZY',
    sheetId: '1aNEX-jyWYXXPL-RjJ-18-XC3iad3GvxFHyrMajgjHUA',
    range: 'Sheet1!A:Z'
};
console.log('Testing Google Sheets API...');
console.log('API Key:', config.apiKey ? config.apiKey.substring(0, 10) + '...' : 'Not found');
console.log('Sheet ID:', config.sheetId);
console.log('Range:', config.range);

const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${config.range}?key=${config.apiKey}`;
console.log('\nTesting URL:', url.substring(0, 100) + '...');

// Test with Node.js fetch
const { fetch } = require('undici');

fetch(url)
    .then(response => {
        console.log('\nResponse Status:', response.status);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
            return response.text().then(errorText => {
                console.log('Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            });
        }
        
        return response.json();
    })
    .then(data => {
        console.log('\n✅ API Success!');
        console.log('Rows received:', data.values ? data.values.length : 0);
        
        if (data.values && data.values.length > 0) {
            console.log('First row (headers):', data.values[0]);
            console.log('Second row (sample data):', data.values[1]);
            
            // Test parsing
            const headers = data.values[0].map(h => h.toLowerCase().trim());
            console.log('\nParsed headers:', headers);
            
            // Check for coordinate columns
            const latIndex = headers.findIndex(h => h.includes('lat'));
            const lngIndex = headers.findIndex(h => h.includes('lng') || h.includes('long'));
            console.log('Latitude column index:', latIndex);
            console.log('Longitude column index:', lngIndex);
            
            // Check for status column (column X = index 23)
            if (data.values[1] && data.values[1][23]) {
                console.log('Status from column X (index 23):', data.values[1][23]);
            }
            
            console.log('\n🎉 API test completed successfully!');
        } else {
            console.log('⚠️ No data found in response');
        }
    })
    .catch(error => {
        console.log('\n❌ API Test Failed:', error.message);
    });