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
        
        // Initial configuration read
        setTimeout(() => {
            this.readCurrentConfig();
            this.updateChatStatus();
        }, 1000);
        
        console.log('✅ AI Configuration Bridge initialized');
    }
    
    monitorAIConfigChanges() {
        // Monitor provider selection changes
        const providerSelect = document.querySelector('select[onchange*="changeProvider"], #aiProvider, .ai-provider-select');
        if (providerSelect) {
            providerSelect.addEventListener('change', () => {
                setTimeout(() => this.readCurrentConfig(), 100);
            });
        }
        
        // Monitor API key changes
        const apiKeyInput = document.querySelector('#externalApiKey, .api-key-input');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('input', () => {
                setTimeout(() => this.readCurrentConfig(), 100);
            });
        }
        
        // Monitor model selection changes
        const modelSelect = document.querySelector('#aiModel, .ai-model-select');
        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                setTimeout(() => this.readCurrentConfig(), 100);
            });
        }
        
        // Monitor test connection results
        this.monitorConnectionTests();
    }
    
    readCurrentConfig() {
        console.log('📖 Reading current AI configuration...');
        
        // Read AI Provider
        const providerElement = document.querySelector('select[onchange*="changeProvider"], #aiProvider, .ai-provider-select');
        if (providerElement && providerElement.value) {
            this.aiProvider = providerElement.value.toLowerCase();
        }
        
        // Read API Key
        const apiKeyElement = document.querySelector('#externalApiKey, .api-key-input');
        if (apiKeyElement && apiKeyElement.value && apiKeyElement.value !== '••••••••••••••••••••••••••••••••••••••••••••••••••••') {
            this.apiKey = apiKeyElement.value.trim();
        }
        
        // Read Model Selection
        const modelElement = document.querySelector('#aiModel, .ai-model-select');
        if (modelElement && modelElement.value) {
            this.selectedModel = modelElement.value;
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
        const testButtons = document.querySelectorAll('button[onclick*="testAIConnection"], .test-ai-connection, #testAiConnection');
        
        testButtons.forEach(button => {
            const originalOnClick = button.onclick;
            button.addEventListener('click', () => {
                // Wait a bit for the test to complete, then re-read config
                setTimeout(() => {
                    this.readCurrentConfig();
                    this.updateChatStatus();
                }, 2000);
            });
        });
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
                            content: 'You are an AI assistant for the Philippines Region 2 Site Tracker dashboard. Help analyze telecommunications site data, provide geographic insights, identify issues, and suggest optimizations for the region.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 1000,
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
                            content: 'You are an AI assistant for the Philippines Region 2 Site Tracker dashboard. Help analyze telecommunications site data, provide geographic insights, identify issues, and suggest optimizations for the region.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 1000,
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
        
        if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
            return "📊 **Data Analysis Available**: I can help analyze your Philippines Region 2 site data including connectivity patterns, performance metrics, and geographic distribution. Please ensure your data is loaded from Google Sheets first, then I can provide comprehensive insights about your telecommunications infrastructure.";
        } 
        
        if (lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
            return "🔍 **Issue Detection**: I can identify various issues in your network data including:\n• Connectivity gaps and outages\n• Missing coordinates or location data\n• Performance anomalies and degradation\n• Coverage problems and blind spots\n• Infrastructure bottlenecks\n\nMake sure your Philippines Region 2 data is loaded first!";
        }
        
        if (lowerMessage.includes('insight') || lowerMessage.includes('recommendation')) {
            return "💡 **Comprehensive Insights**: I can generate detailed insights about your network infrastructure including:\n• Geographic coverage analysis\n• Technology distribution patterns\n• Provider performance comparisons\n• Bandwidth utilization trends\n• Expansion opportunities in Region 2\n\nWhat specific aspect interests you most?";
        }
        
        if (lowerMessage.includes('optimize') || lowerMessage.includes('improvement')) {
            return "⚡ **Network Optimization**: I can help optimize your Philippines Region 2 network by:\n• Suggesting optimal locations for new sites\n• Identifying coverage gaps and solutions\n• Recommending technology upgrades\n• Analyzing traffic patterns and load balancing\n• Improving overall performance metrics\n\nWhat would you like to optimize specifically?";
        }
        
        // Default response
        return `🤖 **AI Assistant Ready**: I understand you're asking about "${message}". 

I can help with:
• **📊 Data Analysis** - Comprehensive site and performance analysis
• **🗺️ Geographic Insights** - Coverage maps and regional patterns  
• **🔍 Issue Detection** - Finding connectivity and performance problems
• **⚡ Optimization** - Network improvement recommendations
• **📈 Performance Monitoring** - Tracking metrics and trends

**Note**: I'm currently using Local AI. For enhanced capabilities, configure OpenRouter or DeepSeek in the AI Configuration panel on the left.

What specific aspect of your Philippines Region 2 network would you like me to focus on?`;
    }
}

// Initialize the bridge
window.aiConfigBridge = new AIConfigBridge();

// Export for use by chat system
window.getAIConfig = () => window.aiConfigBridge.getAIConfig();
window.makeAIRequest = (message, context) => window.aiConfigBridge.makeAIRequest(message, context);

console.log('🌉 AI Configuration Bridge loaded and ready!');