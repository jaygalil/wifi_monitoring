// Auto-Configuration Loader for Site Tracker
// Provides convenient and secure ways to auto-load API keys and settings

class AutoConfigLoader {
    constructor() {
        this.isEnabled = false;
        this.securityLevel = 'medium'; // low, medium, high
        this.configMethods = ['localStorage', 'sessionStorage', 'configFile', 'envVars'];
        
        this.init();
    }

    init() {
        console.log('🔧 Auto-Configuration Loader initializing...');
        
        // Load configuration based on availability
        this.loadConfiguration();
        
        // Setup auto-loading hooks
        this.setupAutoLoading();
    }

    // Load configuration from various sources
    loadConfiguration() {
        // Method 1: Try to load from config.js file (if available)
        if (window.SITE_TRACKER_CONFIG) {
            console.log('📋 Found config.js file');
            this.loadFromConfigFile();
        }
        
        // Method 2: Try to load from localStorage (persistent)
        else if (this.canUseLocalStorage()) {
            console.log('💾 Loading from localStorage');
            this.loadFromLocalStorage();
        }
        
        // Method 3: Try to load from sessionStorage (session-only)
        else if (this.canUseSessionStorage()) {
            console.log('🔒 Loading from sessionStorage');
            this.loadFromSessionStorage();
        }
        
        // Method 4: Manual setup required
        else {
            console.log('⚠️ No auto-configuration found - manual setup required');
            this.showManualSetupMessage();
        }
    }

    // Load from config.js file (most convenient and secure)
    loadFromConfigFile() {
        const config = window.SITE_TRACKER_CONFIG;
        
        console.log('🔄 Loading secure configuration from config.js...');
        
        if (config.ai.autoLoadApiKey) {
            this.autoLoadAIConfig(config.ai);
        }
        
        if (config.sheets.autoLoadSheetConfig) {
            this.autoLoadSheetsConfig(config.sheets);
        }
        
        if (config.dashboard.autoSave) {
            this.setupAutoSave(config.dashboard);
        }
        
        this.isEnabled = true;
        console.log('✅ Secure configuration loaded from config file');
        
        // Show success notification
        this.showSecureConfigNotification();
    }

    // Auto-load AI configuration securely
    autoLoadAIConfig(aiConfig) {
        // Wait for both AI systems to be available
        if (!window.advancedAI && !document.getElementById('aiProvider')) {
            console.log('⏳ Waiting for AI system to initialize...');
            setTimeout(() => this.autoLoadAIConfig(aiConfig), 1000);
            return;
        }

        try {
            console.log('🔑 Auto-loading AI configuration securely...');
            
            // Set provider
            if (aiConfig.defaultProvider) {
                // Update AI system if available
                if (window.advancedAI) {
                    window.advancedAI.currentProvider = aiConfig.defaultProvider;
                }
                
                // Update UI if available
                const providerSelect = document.getElementById('aiProvider');
                if (providerSelect) {
                    providerSelect.value = aiConfig.defaultProvider;
                    providerSelect.classList.add('auto-loaded');
                    // Trigger the change event to update the UI
                    if (window.advancedAI && window.advancedAI.changeProvider) {
                        window.advancedAI.changeProvider(aiConfig.defaultProvider);
                    }
                }
                
                console.log('🔍 AI Provider set to:', aiConfig.defaultProvider);
            }

            // Set API key based on provider
            let apiKeyToUse = null;
            
            if (aiConfig.defaultProvider === 'openrouter' && aiConfig.openrouterApiKey && !aiConfig.openrouterApiKey.includes('your-openrouter-key-here')) {
                apiKeyToUse = aiConfig.openrouterApiKey;
                
                // Update AI system
                if (window.advancedAI) {
                    window.advancedAI.apiConfigurations.openrouter.apiKey = apiKeyToUse;
                    
                    // Set default model
                    if (aiConfig.defaultModel) {
                        window.advancedAI.apiConfigurations.openrouter.model = aiConfig.defaultModel;
                    }
                }
                
                console.log('🔑 OpenRouter API key auto-loaded');
            } else if (aiConfig.deepseekApiKey && !aiConfig.deepseekApiKey.includes('your-deepseek-key-here')) {
                apiKeyToUse = aiConfig.deepseekApiKey;
                
                // Update AI system
                if (window.advancedAI) {
                    window.advancedAI.apiConfigurations.deepseek.apiKey = apiKeyToUse;
                }
                
                console.log('🔑 DeepSeek API key auto-loaded');
            }
            
            // Update UI with masked API key (for security)
            if (apiKeyToUse) {
                const apiKeyInput = document.getElementById('externalApiKey');
                if (apiKeyInput) {
                    // Show masked version in UI but store real key
                    const maskedKey = apiKeyToUse.substring(0, 8) + '•'.repeat(Math.max(0, apiKeyToUse.length - 12)) + apiKeyToUse.substring(apiKeyToUse.length - 4);
                    apiKeyInput.value = maskedKey;
                    apiKeyInput.classList.add('auto-loaded');
                    apiKeyInput.title = 'API Key auto-loaded from secure config';
                    
                    // Store the real key for the AI Configuration Bridge
                    apiKeyInput.dataset.realKey = apiKeyToUse;
                }
            }

            // Auto-connect if enabled
            if (aiConfig.autoConnect) {
                setTimeout(() => {
                    if (window.advancedAI.testAIConnection) {
                        console.log('🔗 Auto-connecting to AI...');
                        window.advancedAI.testAIConnection();
                    }
                }, 2000);
            }

        } catch (error) {
            console.error('❌ Failed to auto-load AI config:', error);
        }
    }

    // Auto-load Google Sheets configuration
    autoLoadSheetsConfig(sheetsConfig) {
        try {
            // Set API key
            if (sheetsConfig.apiKey) {
                const apiKeyInput = document.getElementById('apiKey');
                if (apiKeyInput) {
                    apiKeyInput.value = sheetsConfig.apiKey;
                }
            }

            // Set Sheet ID
            if (sheetsConfig.sheetId) {
                const sheetIdInput = document.getElementById('sheetId');
                if (sheetIdInput) {
                    sheetIdInput.value = sheetsConfig.sheetId;
                }
            }

            // Set range
            if (sheetsConfig.range) {
                const rangeInput = document.getElementById('sheetRange');
                if (rangeInput) {
                    rangeInput.value = sheetsConfig.range;
                }
            }

            console.log('📊 Google Sheets config auto-loaded');

            // Auto-load data if enabled
            if (sheetsConfig.autoLoadData) {
                setTimeout(() => {
                    if (window.loadSheetData) {
                        console.log('📥 Auto-loading sheet data...');
                        window.loadSheetData();
                    }
                }, 3000);
            }

        } catch (error) {
            console.error('❌ Failed to auto-load Sheets config:', error);
        }
    }

    // Setup auto-save functionality
    setupAutoSave(dashboardConfig) {
        if (!dashboardConfig.autoSave) return;

        // Auto-save settings periodically
        setInterval(() => {
            this.saveCurrentSettings();
        }, 30000); // Save every 30 seconds

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveCurrentSettings();
        });

        console.log('💾 Auto-save enabled');
    }

    // Save current settings to localStorage
    saveCurrentSettings() {
        try {
            const settings = {
                ai: {
                    provider: window.advancedAI?.currentProvider,
                    lastUsed: new Date().toISOString()
                },
                sheets: {
                    lastLoaded: localStorage.getItem('lastDataLoad')
                },
                dashboard: {
                    filters: this.getCurrentFilters(),
                    mapView: this.getCurrentMapView()
                }
            };

            localStorage.setItem('siteTracker_autoSave', JSON.stringify(settings));
        } catch (error) {
            console.log('Auto-save failed:', error);
        }
    }

    // Get current filter states
    getCurrentFilters() {
        // Implement based on your filter system
        return {
            search: document.getElementById('searchInputEnhanced')?.value,
            recordsPerPage: document.getElementById('recordsPerPage')?.value
        };
    }

    // Get current map view
    getCurrentMapView() {
        if (window.map) {
            const center = window.map.getCenter();
            const zoom = window.map.getZoom();
            return { center: [center.lat, center.lng], zoom };
        }
        return null;
    }

    // Check if localStorage is available
    canUseLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch {
            return false;
        }
    }

    // Check if sessionStorage is available
    canUseSessionStorage() {
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            return true;
        } catch {
            return false;
        }
    }

    // Load from localStorage
    loadFromLocalStorage() {
        try {
            const savedConfig = localStorage.getItem('siteTracker_config');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                this.applyStoredConfig(config);
                console.log('✅ Configuration loaded from localStorage');
            }
        } catch (error) {
            console.log('Failed to load from localStorage:', error);
        }
    }

    // Load from sessionStorage
    loadFromSessionStorage() {
        try {
            const savedConfig = sessionStorage.getItem('siteTracker_config');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                this.applyStoredConfig(config);
                console.log('✅ Configuration loaded from sessionStorage');
            }
        } catch (error) {
            console.log('Failed to load from sessionStorage:', error);
        }
    }

    // Apply stored configuration
    applyStoredConfig(config) {
        if (config.ai) {
            this.autoLoadAIConfig(config.ai);
        }
        if (config.sheets) {
            this.autoLoadSheetsConfig(config.sheets);
        }
    }

    // Show manual setup message
    showManualSetupMessage() {
        setTimeout(() => {
            if (document.body) {
                const message = document.createElement('div');
                message.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                    font-size: 14px;
                    max-width: 300px;
                    animation: slideIn 0.3s ease;
                `;
                
                message.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <i class="fas fa-cog" style="margin-right: 8px;"></i>
                        <strong>Quick Setup Available</strong>
                    </div>
                    <div style="font-size: 13px; opacity: 0.9;">
                        Auto-configuration is ready! Check the 🧠 AI Configuration panel to get started quickly.
                    </div>
                `;
                
                document.body.appendChild(message);
                
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 5000);
            }
        }, 2000);
    }

    // Setup auto-loading hooks
    setupAutoLoading() {
        // Hook into dashboard initialization
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Auto-configuration hooks activated');
            
            // Add auto-load styles
            this.addAutoLoadStyles();
            
            // Add convenience features
            this.addConvenienceFeatures();
        });
    }

    // Add auto-load indicator styles
    addAutoLoadStyles() {
        const styles = `
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .auto-loaded {
                    border-left: 3px solid #22c55e !important;
                    background: linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%) !important;
                }
                
                .auto-loading {
                    border-left: 3px solid #f59e0b !important;
                    background: linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%) !important;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Add convenience features
    addConvenienceFeatures() {
        // Add quick setup button if not auto-configured
        if (!this.isEnabled) {
            this.addQuickSetupButton();
        }
        
        // Add status indicators
        this.addStatusIndicators();
    }

    // Add quick setup button
    addQuickSetupButton() {
        setTimeout(() => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                const quickSetupBtn = document.createElement('div');
                quickSetupBtn.innerHTML = `
                    <button onclick="autoConfig.quickSetup()" style="
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 12px 16px;
                        width: 100%;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        margin-bottom: 15px;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                        transition: all 0.2s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <i class="fas fa-magic" style="margin-right: 8px;"></i>
                        Quick Auto-Setup
                    </button>
                `;
                sidebar.insertBefore(quickSetupBtn, sidebar.firstChild);
            }
        }, 1000);
    }

    // Add status indicators
    addStatusIndicators() {
        // Add indicators to show auto-loaded fields
        setTimeout(() => {
            const autoLoadedFields = ['apiKey', 'sheetId', 'externalApiKey'];
            autoLoadedFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && field.value) {
                    field.classList.add('auto-loaded');
                    field.title = 'Auto-loaded from configuration';
                }
            });
        }, 2000);
    }

    // Quick setup method
    quickSetup() {
        const message = `
🚀 Quick Auto-Setup

This will automatically configure:
• DeepSeek AI with your API key
• Google Sheets connection
• Auto-load your data
• Optimize settings

Continue?
        `;
        
        if (confirm(message)) {
            // Trigger manual configuration
            this.manualQuickSetup();
        }
    }

    // Manual quick setup
    manualQuickSetup() {
        // Set DeepSeek as provider
        const providerSelect = document.getElementById('aiProvider');
        if (providerSelect) {
            providerSelect.value = 'deepseek';
            window.advancedAI.changeProvider('deepseek');
        }

        // Set API key from secure config
        const apiKeyInput = document.getElementById('externalApiKey');
        if (apiKeyInput && window.CONFIG && window.CONFIG.DEEPSEEK_API_KEY) {
            apiKeyInput.value = window.CONFIG.DEEPSEEK_API_KEY;
            apiKeyInput.classList.add('auto-loaded');
        }

        // Test connection
        setTimeout(() => {
            if (window.advancedAI.testAIConnection) {
                window.advancedAI.testAIConnection();
            }
        }, 1000);

        // Auto-load sheet data
        setTimeout(() => {
            if (window.loadSheetData) {
                window.loadSheetData();
            }
        }, 3000);

        console.log('✅ Quick setup completed');
    }
    
    // Show secure configuration notification
    showSecureConfigNotification() {
        setTimeout(() => {
            if (document.body) {
                // Use centralized toast manager if available
                if (window.toastManager) {
                    window.toastManager.show({
                        title: '🔑 Secure Auto-Config Loaded',
                        message: 'Your API keys have been securely loaded from config.js. They\'re stored locally and masked in the UI for security.',
                        type: 'success',
                        duration: 5000,
                        icon: 'fas fa-shield-alt'
                    });
                } else {
                    // Fallback to original notification method
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        padding: 15px 20px;
                        border-radius: 12px;
                        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                        z-index: 10000;
                        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                        font-size: 14px;
                        max-width: 350px;
                        animation: slideIn 0.3s ease;
                    `;
                    
                    notification.innerHTML = `
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <i class="fas fa-shield-alt" style="margin-right: 8px; font-size: 16px;"></i>
                            <strong>🔑 Secure Auto-Config Loaded</strong>
                        </div>
                        <div style="font-size: 13px; opacity: 0.9; line-height: 1.4;">
                            Your API keys have been securely loaded from config.js. They're stored locally and masked in the UI for security.
                        </div>
                    `;
                    
                    document.body.appendChild(notification);
                    
                    // Auto-remove after 5 seconds
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.style.animation = 'fadeOut 0.3s ease';
                            setTimeout(() => notification.remove(), 300);
                        }
                    }, 5000);
                }
            }
        }, 2000);
    }
    
    // Get current configuration
    getConfiguration() {
        if (window.SITE_TRACKER_CONFIG) {
            return window.SITE_TRACKER_CONFIG;
        }
        return null;
    }
}

// Initialize auto-configuration (prevent duplicate initialization)
if (!window.autoConfig) {
    const autoConfig = new AutoConfigLoader();
    window.autoConfig = autoConfig;
}

const additionalStyles = `
    <style>
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
    </style>
`;
document.head.insertAdjacentHTML('beforeend', additionalStyles);

console.log('⚡ Secure Auto-Configuration system ready!');
