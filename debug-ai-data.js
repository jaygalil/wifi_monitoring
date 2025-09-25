// Debug script to test AI chatbot data access
// Run this in the browser console to verify data access

function debugAIDataAccess() {
    console.log('🔍 === AI Data Access Debug Report ===');
    
    // Check global data variables
    console.log('\n📊 Global Data Variables:');
    console.log('window.allData:', window.allData ? `${window.allData.length} records` : 'undefined');
    console.log('window.filteredData:', window.filteredData ? `${window.filteredData.length} records` : 'undefined');
    console.log('window.currentData:', window.currentData ? `${window.currentData.length} records` : 'undefined');
    
    // Check localStorage backup
    console.log('\n💾 localStorage Backup:');
    try {
        const storedData = localStorage.getItem('siteTracker_lastData');
        if (storedData) {
            const data = JSON.parse(storedData);
            console.log('siteTracker_lastData:', `${data.length} records`);
            console.log('Sample record:', data[0]);
        } else {
            console.log('siteTracker_lastData: not found');
        }
    } catch (e) {
        console.log('siteTracker_lastData: error reading -', e.message);
    }
    
    // Check AI systems
    console.log('\n🤖 AI Systems:');
    console.log('AI Assistant:', window.aiAssistant ? 'loaded' : 'not found');
    console.log('AI Config Bridge:', window.aiConfigBridge ? 'loaded' : 'not found');
    console.log('Enhanced Chat:', window.enhancedChat ? 'loaded' : 'not found');
    
    // Test AI Configuration Bridge data access
    if (window.aiConfigBridge) {
        console.log('\n🔗 Testing AI Configuration Bridge:');
        const bridgeData = window.aiConfigBridge.getCurrentDashboardData();
        console.log('Bridge data result:', {
            hasValidData: bridgeData.hasValidData,
            dataLength: bridgeData.data.length,
            rowCount: bridgeData.rowCount
        });
    }
    
    // Test AI Assistant data access
    if (window.aiAssistant) {
        console.log('\n🦾 Testing AI Assistant:');
        const assistantData = window.aiAssistant.getCurrentData();
        console.log('Assistant data result:', `${assistantData.length} records`);
        if (assistantData.length > 0) {
            console.log('Sample record:', assistantData[0]);
        }
    }
    
    // Test make AI request function
    console.log('\n🔧 AI Request Functions:');
    console.log('window.makeAIRequest:', typeof window.makeAIRequest);
    console.log('window.getAIConfig:', typeof window.getAIConfig);
    
    // Check AI configuration
    if (window.getAIConfig) {
        console.log('\n⚙️ AI Configuration:');
        const config = window.getAIConfig();
        console.log('AI Config:', {
            provider: config.provider,
            hasApiKey: !!config.apiKey,
            model: config.model,
            isConnected: config.isConnected
        });
    }
    
    console.log('\n✅ Debug report complete!');
    console.log('\n💡 To test the AI chatbot:');
    console.log('1. Open the AI chat panel');
    console.log('2. Ask: "Analyze my data"');
    console.log('3. Check if it responds with actual data insights');
}

// Test AI request with sample message
async function testAIRequest(message = 'Analyze my data') {
    console.log(`🧪 Testing AI request with: "${message}"`);
    
    if (!window.makeAIRequest) {
        console.log('❌ window.makeAIRequest not available');
        return;
    }
    
    try {
        const response = await window.makeAIRequest(message, window.allData || []);
        console.log('✅ AI Response:', response);
    } catch (error) {
        console.log('❌ AI Request failed:', error.message);
    }
}

// Auto-run debug on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(debugAIDataAccess, 3000);
    });
} else {
    setTimeout(debugAIDataAccess, 1000);
}

// Make functions available globally
window.debugAIDataAccess = debugAIDataAccess;
window.testAIRequest = testAIRequest;

console.log('🔧 AI Data Debug script loaded. Run debugAIDataAccess() or testAIRequest() in console.');