// AI Configuration Bridge
// Connects the AI Configuration panel with the chat system

class AIConfigBridge {
    constructor() {
        this.aiProvider = 'local';
        this.apiKey = null;
        this.selectedModel = null;
        this.isConnected = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupBridge());
        } else {
            this.setupBridge();
        }
    }
    
    setupBridge() {
        console.log('🔗 Setting up AI Configuration Bridge...');
        
        // Monitor AI configuration changes
        this.monitorAIConfigChanges();
        
        // Initial configuration read (wait longer for UI to load)
        setTimeout(() => {
            this.readCurrentConfig();
            this.updateChatStatus();
        }, 2000);
        
        // Retry after another delay to ensure everything is loaded
        setTimeout(() => {
            this.readCurrentConfig();
            this.updateChatStatus();
        }, 5000);
        
        console.log('✅ AI Configuration Bridge initialized');
    }
    
    monitorAIConfigChanges() {
        // Monitor provider selection changes
        const providerSelect = document.querySelector('#aiProvider');
        if (providerSelect) {
            providerSelect.addEventListener('change', () => {
                setTimeout(() => this.readCurrentConfig(), 100);
            });
            console.log('✅ Found AI Provider select element');
        } else {
            console.warn('⚠️ AI Provider select not found');
        }
        
        // Monitor API key changes
        const apiKeyInput = document.querySelector('#externalApiKey');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('input', () => {
                setTimeout(() => this.readCurrentConfig(), 100);
            });
            console.log('✅ Found API Key input element');
        } else {
            console.warn('⚠️ API Key input not found');
        }
        
        // Monitor model selection changes
        const modelSelect = document.querySelector('#aiModelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                setTimeout(() => this.readCurrentConfig(), 100);
            });
            console.log('✅ Found AI Model select element');
        } else {
            console.warn('⚠️ AI Model select not found');
        }
        
        // Monitor test connection results
        this.monitorConnectionTests();
    }
    
    readCurrentConfig() {
        console.log('📜 Reading current AI configuration...');
        
        // Read AI Provider
        const providerElement = document.querySelector('#aiProvider');
        if (providerElement && providerElement.value) {
            this.aiProvider = providerElement.value.toLowerCase();
            console.log('🔍 Provider found:', this.aiProvider);
        } else {
            console.warn('⚠️ Provider element not found or no value');
        }
        
        // Read API Key - check for both visible and stored keys
        const apiKeyElement = document.querySelector('#externalApiKey');
        if (apiKeyElement) {
            // First, try to get the real key from dataset (auto-loaded keys)
            if (apiKeyElement.dataset.realKey) {
                this.apiKey = apiKeyElement.dataset.realKey;
                console.log('🔑 Real API Key found from secure config (length:', this.apiKey.length, ')');
            }
            // Otherwise, check if user entered a key directly
            else if (apiKeyElement.value && apiKeyElement.value.length > 5 && !apiKeyElement.value.includes('•')) {
                this.apiKey = apiKeyElement.value.trim();
                console.log('🔑 API Key entered by user (length:', this.apiKey.length, ')');
            }
            // Check for masked keys (dots) - indicates auto-loaded
            else if (apiKeyElement.value.includes('•') && apiKeyElement.value.length > 10) {
                // Try to get from config if available
                const config = window.SITE_TRACKER_CONFIG;
                if (config && config.ai) {
                    const provider = this.aiProvider || 'openrouter';
                    if (provider === 'openrouter' && config.ai.openrouterApiKey && !config.ai.openrouterApiKey.includes('your-openrouter-key-here')) {
                        this.apiKey = config.ai.openrouterApiKey;
                        console.log('🔑 API Key loaded from config.js (OpenRouter)');
                    } else if (provider === 'deepseek' && config.ai.deepseekApiKey && !config.ai.deepseekApiKey.includes('your-deepseek-key-here')) {
                        this.apiKey = config.ai.deepseekApiKey;
                        console.log('🔑 API Key loaded from config.js (DeepSeek)');
                    }
                }
            }
        } else {
            console.warn('⚠️ API Key element not found');
        }
        
        // Read Model Selection
        const modelElement = document.querySelector('#aiModelSelect');
        if (modelElement && modelElement.value) {
            this.selectedModel = modelElement.value;
            console.log('🤖 Model found:', this.selectedModel);
        } else if (modelElement) {
            // If no model selected, use the first available option
            const firstOption = modelElement.querySelector('option[value]:not([value=""])');
            if (firstOption) {
                this.selectedModel = firstOption.value;
                modelElement.value = this.selectedModel; // Select it
                console.log('🤖 Auto-selected first model:', this.selectedModel);
            }
        } else {
            console.warn('⚠️ Model select element not found');
        }
        
        // Check if we have a valid configuration
        this.isConnected = this.validateConfiguration();
        
        console.log('📊 Current AI Configuration:', {
            provider: this.aiProvider,
            hasApiKey: !!this.apiKey,
            model: this.selectedModel,
            isConnected: this.isConnected
        });
        
        // Update chat system
        this.updateChatStatus();
        
        return {
            provider: this.aiProvider,
            apiKey: this.apiKey,
            model: this.selectedModel,
            isConnected: this.isConnected
        };
    }
    
    validateConfiguration() {
        if (this.aiProvider === 'local') {
            return true; // Local AI always works
        }
        
        if (this.aiProvider === 'openrouter' || this.aiProvider === 'deepseek') {
            return !!(this.apiKey && this.apiKey.length > 10);
        }
        
        return false;
    }
    
    updateChatStatus() {
        // Update chat footer with current provider info
        const chatModelInfo = document.getElementById('activeModelName');
        if (chatModelInfo) {
            let displayText = 'Local AI';
            
            if (this.isConnected && this.aiProvider !== 'local') {
                const providerName = this.aiProvider === 'openrouter' ? 'OpenRouter' : 
                                   this.aiProvider === 'deepseek' ? 'DeepSeek' : this.aiProvider;
                
                const modelName = this.selectedModel || 'Default Model';
                displayText = `${providerName} - ${modelName}`;
            }
            
            chatModelInfo.textContent = displayText;
        }
        
        // Update connection status indicator
        const statusIndicator = document.getElementById('chatConnectionStatus');
        if (statusIndicator) {
            statusIndicator.style.color = this.isConnected && this.aiProvider !== 'local' ? '#4ade80' : '#fbbf24';
        }
        
        console.log('📱 Chat status updated:', {
            provider: this.aiProvider,
            connected: this.isConnected
        });
    }
    
    monitorConnectionTests() {
        // Look for test connection buttons and monitor their results
        const testButton = document.querySelector('#testAIBtn');
        
        if (testButton) {
            testButton.addEventListener('click', () => {
                // Wait a bit for the test to complete, then re-read config
                setTimeout(() => {
                    this.readCurrentConfig();
                    this.updateChatStatus();
                }, 2000);
            });
            console.log('✅ Found Test AI Connection button');
        } else {
            console.warn('⚠️ Test AI Connection button not found');
        }
    }
    
    // Public method for chat system to get AI configuration
    getAIConfig() {
        return {
            provider: this.aiProvider,
            apiKey: this.apiKey,
            model: this.selectedModel,
            isConnected: this.isConnected
        };
    }
    
    // Public method for making AI requests
    async makeAIRequest(message, context = []) {
        const config = this.getAIConfig();
        
        if (!config.isConnected) {
            throw new Error('AI provider not configured or connected');
        }
        
        if (config.provider === 'local') {
            return this.generateLocalResponse(message, context);
        }
        
        if (config.provider === 'openrouter') {
            return this.makeOpenRouterRequest(message, context, config);
        }
        
        if (config.provider === 'deepseek') {
            return this.makeDeepSeekRequest(message, context, config);
        }
        
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
    
    async makeOpenRouterRequest(message, context, config) {
        try {
            // Get current data from the dashboard
            const currentData = this.getCurrentDashboardData();
            const dataContext = this.formatDataForAI(currentData);
            
            // Create enhanced system prompt with data context
            let systemPrompt = 'You are an AI assistant for the Philippines Region 2 Site Tracker dashboard. Help analyze telecommunications site data, provide geographic insights, identify issues, and suggest optimizations for the region.';
            
            if (dataContext.hasData) {
                systemPrompt += `\n\nCurrent Dashboard Data Context:\n${dataContext.summary}\n\nYou can reference this data in your responses and provide specific insights based on the actual loaded data.`;
            }
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Philippines Region 2 Site Tracker'
                },
                body: JSON.stringify({
                    model: config.model || 'deepseek/deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: dataContext.hasData ? `${message}\n\nPlease analyze the current data: ${dataContext.dataPreview}` : message
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('OpenRouter request failed:', error);
            throw new Error(`OpenRouter AI request failed: ${error.message}`);
        }
    }
    
    async makeDeepSeekRequest(message, context, config) {
        try {
            // Get current data from the dashboard
            const currentData = this.getCurrentDashboardData();
            const dataContext = this.formatDataForAI(currentData);
            
            // Create enhanced system prompt with data context
            let systemPrompt = 'You are an AI assistant for the Philippines Region 2 Site Tracker dashboard. Help analyze telecommunications site data, provide geographic insights, identify issues, and suggest optimizations for the region.';
            
            if (dataContext.hasData) {
                systemPrompt += `\n\nCurrent Dashboard Data Context:\n${dataContext.summary}\n\nYou can reference this data in your responses and provide specific insights based on the actual loaded data.`;
            }
            
            const response = await fetch('https://api.deepseek.com/beta/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.model || 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: dataContext.hasData ? `${message}\n\nPlease analyze the current data: ${dataContext.dataPreview}` : message
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('DeepSeek request failed:', error);
            throw new Error(`DeepSeek AI request failed: ${error.message}`);
        }
    }
    
    generateLocalResponse(message, context) {
        const lowerMessage = message.toLowerCase();
        
        // Get current data for local analysis
        const currentData = this.getCurrentDashboardData();
        const dataContext = this.formatDataForAI(currentData);
        
        if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
            if (dataContext.hasData) {
                return `📊 **Data Analysis**: I can see you have ${dataContext.recordCount} sites loaded from your Philippines Region 2 data.\n\n${dataContext.basicAnalysis}\n\n**Geographic Distribution:**\n${dataContext.locationSummary}\n\n**Technology Breakdown:**\n${dataContext.technologySummary}\n\nFor deeper AI-powered analysis, configure OpenRouter or DeepSeek in the left panel.`;
            } else {
                return "📊 **Data Analysis Available**: I can help analyze your Philippines Region 2 site data including connectivity patterns, performance metrics, and geographic distribution. Please load your data from Google Sheets first using the 'Load Data' button in the left panel.";
            }
        } 
        
        if (lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
            if (dataContext.hasData) {
                return `🔍 **Issue Detection Results**: Based on your ${dataContext.recordCount} loaded sites:\n\n${dataContext.issueAnalysis}\n\n**Recommendations:**\n• Review sites with missing coordinates\n• Check connectivity status for inactive sites\n• Verify data completeness for better analysis\n\nFor advanced issue detection, enable external AI providers.`;
            } else {
                return "🔍 **Issue Detection**: Load your Philippines Region 2 data first, then I can identify connectivity gaps, missing coordinates, performance anomalies, and coverage problems in your actual network data.";
            }
        }
        
        if (lowerMessage.includes('insight') || lowerMessage.includes('recommendation')) {
            if (dataContext.hasData) {
                return `💡 **Network Insights**: From your ${dataContext.recordCount} sites:\n\n**Coverage Analysis:**\n${dataContext.coverageInsights}\n\n**Provider Distribution:**\n${dataContext.providerInsights}\n\n**Key Recommendations:**\n• Focus expansion in underserved areas\n• Optimize existing site performance\n• Consider technology upgrades where needed\n\nWhat specific aspect would you like me to explore further?`;
            } else {
                return "💡 **Comprehensive Insights**: Load your data first to get specific insights about geographic coverage, technology distribution, provider performance, and expansion opportunities in Philippines Region 2.";
            }
        }
        
        if (lowerMessage.includes('optimize') || lowerMessage.includes('improvement')) {
            if (dataContext.hasData) {
                return `⚡ **Optimization Opportunities**: Based on your current ${dataContext.recordCount} sites:\n\n${dataContext.optimizationSuggestions}\n\n**Priority Actions:**\n• Address coverage gaps in remote areas\n• Upgrade legacy technology sites\n• Improve site density in high-demand areas\n• Enhance redundancy for critical locations\n\nConfigure external AI for detailed optimization strategies.`;
            } else {
                return "⚡ **Network Optimization**: Load your Philippines Region 2 site data first, then I can suggest optimal locations for new sites, identify coverage gaps, recommend technology upgrades, and improve overall performance metrics.";
            }
        }
        
        // Default response with data context
        if (dataContext.hasData) {
            return `🤖 **AI Assistant Ready**: I can see you have ${dataContext.recordCount} sites loaded from Philippines Region 2.\n\n**Quick Data Overview:**\n${dataContext.quickSummary}\n\nI can help with:\n• **📊 Data Analysis** - Analyze your ${dataContext.recordCount} sites\n• **🗺️ Geographic Insights** - Regional coverage patterns\n• **🔍 Issue Detection** - Find problems in your data\n• **⚡ Optimization** - Improvement recommendations\n\nWhat would you like me to analyze about your network data?`;
        } else {
            return `🤖 **AI Assistant Ready**: I understand you're asking about "${message}".\n\n**No data loaded yet** - Please use the 'Load Data' button to fetch your Philippines Region 2 site data from Google Sheets.\n\nOnce loaded, I can help with:\n• **📊 Data Analysis** - Comprehensive analysis\n• **🗺️ Geographic Insights** - Coverage patterns\n• **🔍 Issue Detection** - Problem identification\n• **⚡ Optimization** - Network improvements\n\n**Note**: Configure OpenRouter or DeepSeek for advanced AI capabilities.`;
        }
    }
    
    // Get current dashboard data
    getCurrentDashboardData() {
        // Priority: Try to get data from various global variables
        let data = window.allData || window.filteredData || window.currentData || [];
        
        console.log('🔍 Checking for dashboard data...');
        console.log('window.allData:', window.allData ? `${window.allData.length} records` : 'not found');
        console.log('window.filteredData:', window.filteredData ? `${window.filteredData.length} records` : 'not found');
        
        // If no data found, try to check if data exists in localStorage as backup
        if (!data || data.length === 0) {
            try {
                const storedData = localStorage.getItem('siteTracker_lastData');
                if (storedData) {
                    data = JSON.parse(storedData);
                    console.log('📦 Loaded backup data from localStorage:', data.length, 'records');
                }
            } catch (e) {
                console.log('No backup data available in localStorage');
            }
        }
        
        // Also check for data in table as fallback
        const tableBody = document.querySelector('#dataTableBody');
        const rows = tableBody ? tableBody.querySelectorAll('tr:not(.no-data)') : [];
        
        const result = {
            data: data,
            rowCount: rows.length,
            hasValidData: data && data.length > 0
        };
        
        console.log('📊 Dashboard data check result:', {
            dataLength: result.data.length,
            hasValidData: result.hasValidData,
            tableRows: result.rowCount
        });
        
        return result;
    }
    
    // Format data for AI analysis
    formatDataForAI(currentData) {
        if (!currentData.hasValidData) {
            return {
                hasData: false,
                summary: 'No data currently loaded',
                recordCount: 0
            };
        }
        
        const data = currentData.data;
        const recordCount = data.length;
        
        // Analyze the data structure
        const sampleRecord = data[0] || {};
        const fields = Object.keys(sampleRecord);
        
        // Basic analysis
        const locationFields = fields.filter(f => f.toLowerCase().includes('location') || f.toLowerCase().includes('address') || f.toLowerCase().includes('province') || f.toLowerCase().includes('barangay'));
        const techFields = fields.filter(f => f.toLowerCase().includes('technology') || f.toLowerCase().includes('type') || f.toLowerCase().includes('provider'));
        const coordFields = fields.filter(f => f.toLowerCase().includes('lat') || f.toLowerCase().includes('lng') || f.toLowerCase().includes('longitude'));
        
        // Generate summaries
        const locationSummary = this.analyzeLocations(data, locationFields);
        const technologySummary = this.analyzeTechnology(data, techFields);
        const coordinateAnalysis = this.analyzeCoordinates(data, coordFields);
        
        return {
            hasData: true,
            recordCount: recordCount,
            summary: `${recordCount} telecommunications sites with ${fields.length} data fields`,
            dataPreview: `Fields: ${fields.slice(0, 5).join(', ')}${fields.length > 5 ? '...' : ''}`,
            basicAnalysis: `📍 Location data: ${locationSummary}`,
            locationSummary: locationSummary,
            technologySummary: technologySummary,
            issueAnalysis: coordinateAnalysis,
            coverageInsights: `Geographic spread across ${locationFields.length > 0 ? 'multiple locations' : 'region'}`,
            providerInsights: techFields.length > 0 ? `Multiple providers/technologies detected` : 'Provider data available',
            optimizationSuggestions: `Review ${recordCount} sites for optimization opportunities`,
            quickSummary: `${recordCount} sites • ${locationFields.length} location fields • ${techFields.length} tech fields`
        };
    }
    
    // Analyze location data
    analyzeLocations(data, locationFields) {
        if (locationFields.length === 0) return 'Location fields not clearly identified';
        
        const locationField = locationFields[0];
        const locations = [...new Set(data.map(row => row[locationField]).filter(Boolean))];
        
        return `${locations.length} unique locations detected in ${locationField}`;
    }
    
    // Analyze technology data
    analyzeTechnology(data, techFields) {
        if (techFields.length === 0) return 'Technology fields not clearly identified';
        
        const techField = techFields[0];
        const technologies = [...new Set(data.map(row => row[techField]).filter(Boolean))];
        
        return `${technologies.length} different technologies/providers: ${technologies.slice(0, 3).join(', ')}${technologies.length > 3 ? '...' : ''}`;
    }
    
    // Analyze coordinate data
    analyzeCoordinates(data, coordFields) {
        if (coordFields.length === 0) return 'No coordinate fields found - may impact mapping accuracy';
        
        const coordField = coordFields[0];
        const validCoords = data.filter(row => row[coordField] && !isNaN(parseFloat(row[coordField]))).length;
        const missingCoords = data.length - validCoords;
        
        if (missingCoords > 0) {
            return `⚠️ ${missingCoords} sites missing coordinates - these won't appear on the map`;
        } else {
            return `✅ All ${data.length} sites have coordinate data`;
        }
    }
    
    // Callback when data is updated
    onDataUpdated() {
        console.log('🔄 AI Configuration Bridge: Data updated, refreshing data access...');
        
        // Clear any cached data and re-read configuration
        this.readCurrentConfig();
        
        // Update chat status to reflect new data availability
        this.updateChatStatus();
        
        // Log current data status
        const currentData = this.getCurrentDashboardData();
        console.log('📊 AI Bridge data status after update:', {
            hasData: currentData.hasValidData,
            recordCount: currentData.hasValidData ? currentData.data.length : 0
        });
    }
}

// Initialize the bridge
window.aiConfigBridge = new AIConfigBridge();

// Export for use by chat system
window.getAIConfig = () => window.aiConfigBridge.getAIConfig();
window.makeAIRequest = (message, context) => window.aiConfigBridge.makeAIRequest(message, context);

console.log('🌉 AI Configuration Bridge loaded and ready!');