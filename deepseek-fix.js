// DeepSeek API Fix - Alternative configurations to try
// Load this after the main configuration to override DeepSeek settings

(function() {
    console.log('🔧 Loading DeepSeek API fixes...');

    // Alternative DeepSeek configurations to try
    const deepSeekConfigurations = [
        {
            name: 'DeepSeek Official API',
            endpoint: 'https://api.deepseek.com/chat/completions',
            model: 'deepseek-chat'
        },
        {
            name: 'DeepSeek V1 API',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-chat'
        },
        {
            name: 'DeepSeek Coder API',
            endpoint: 'https://api.deepseek.com/chat/completions',
            model: 'deepseek-coder'
        },
        {
            name: 'DeepSeek Beta API',
            endpoint: 'https://api.deepseek.com/beta/chat/completions',
            model: 'deepseek-chat'
        }
    ];

    // Enhanced DeepSeek API caller with multiple endpoint fallback
    window.enhancedDeepSeekTest = async function(apiKey) {
        console.log('🧪 Testing DeepSeek with multiple configurations...');
        
        for (let i = 0; i < deepSeekConfigurations.length; i++) {
            const config = deepSeekConfigurations[i];
            console.log(`Trying ${config.name}:`, config.endpoint);
            
            try {
                const response = await fetch(config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        model: config.model,
                        messages: [
                            {
                                role: 'user',
                                content: 'Hello! Please respond with: Connection test successful'
                            }
                        ],
                        max_tokens: 50,
                        temperature: 0.3
                    })
                });

                console.log(`${config.name} Response:`, response.status, response.statusText);

                if (response.ok) {
                    const data = await response.json();
                    console.log(`${config.name} Data:`, data);
                    
                    const content = data.choices?.[0]?.message?.content;
                    if (content) {
                        console.log(`✅ ${config.name} SUCCESS!`, content);
                        
                        // Update the main configuration with working endpoint
                        if (window.advancedAI) {
                            window.advancedAI.apiConfigurations.deepseek.endpoint = config.endpoint;
                            window.advancedAI.apiConfigurations.deepseek.model = config.model;
                            console.log('🔧 Updated main configuration with working endpoint');
                        }
                        
                        return { success: true, config: config, response: content };
                    }
                } else {
                    const errorText = await response.text();
                    console.log(`❌ ${config.name} failed:`, response.status, errorText);
                }
            } catch (error) {
                console.log(`❌ ${config.name} error:`, error.message);
            }
        }
        
        return { success: false, error: 'All configurations failed' };
    };

    // Manual test function you can call from browser console
    window.testDeepSeekManually = function() {
        const apiKey = 'sk-94c4febd21ba488e8bdb499c52c3e8eb';
        console.log('🔧 Manual DeepSeek Test Started...');
        window.enhancedDeepSeekTest(apiKey).then(result => {
            if (result.success) {
                alert(`✅ DeepSeek Connected!\n\nWorking configuration: ${result.config.name}\nResponse: ${result.response}`);
            } else {
                alert(`❌ All DeepSeek configurations failed.\n\nPlease check:\n1. Your API key is correct\n2. You have internet access\n3. DeepSeek service is available`);
            }
        });
    };

    // Auto-fix function that tries to resolve the connection
    window.autoFixDeepSeek = async function() {
        console.log('🔧 Auto-fixing DeepSeek connection...');
        
        const apiKey = document.getElementById('externalApiKey')?.value || 'sk-94c4febd21ba488e8bdb499c52c3e8eb';
        
        if (!apiKey || apiKey.length < 10) {
            alert('❌ Please enter a valid DeepSeek API key first');
            return;
        }

        const testBtn = document.getElementById('testAIBtn');
        const statusDiv = document.getElementById('aiStatus');
        
        if (testBtn) {
            testBtn.disabled = true;
            testBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Auto-fixing...';
        }

        const result = await window.enhancedDeepSeekTest(apiKey);
        
        if (result.success) {
            if (statusDiv) {
                statusDiv.innerHTML = '<small class="text-success"><i class="fas fa-check-circle me-1"></i>DEEPSEEK Connected (Auto-fixed)</small>';
                statusDiv.style.display = 'block';
            }
            
            // Store the working configuration
            if (window.advancedAI) {
                window.advancedAI.apiConfigurations.deepseek.apiKey = apiKey;
            }
            
            console.log('✅ DeepSeek auto-fix successful!');
            alert(`✅ DeepSeek Connection Fixed!\n\nUsing: ${result.config.name}\nResponse: ${result.response}`);
        } else {
            if (statusDiv) {
                statusDiv.innerHTML = '<small class="text-danger"><i class="fas fa-exclamation-triangle me-1"></i>Auto-fix failed - using Local AI</small>';
                statusDiv.style.display = 'block';
            }
            
            console.log('❌ DeepSeek auto-fix failed, falling back to local AI');
            
            // Switch to local AI
            const providerSelect = document.getElementById('aiProvider');
            if (providerSelect) {
                providerSelect.value = 'local';
                if (window.advancedAI) {
                    window.advancedAI.changeProvider('local');
                }
            }
        }
        
        if (testBtn) {
            testBtn.disabled = false;
            testBtn.innerHTML = '<i class="fas fa-satellite me-2"></i>Test AI Connection';
        }

        // Hide status after 5 seconds
        setTimeout(() => {
            if (statusDiv) {
                statusDiv.style.display = 'none';
            }
        }, 5000);
    };

    // Add auto-fix button to the UI
    function addAutoFixButton() {
        const configPanel = document.querySelector('.ai-config-section');
        if (configPanel) {
            const autoFixBtn = document.createElement('div');
            autoFixBtn.style.marginTop = '10px';
            autoFixBtn.innerHTML = `
                <button onclick="window.autoFixDeepSeek()" style="
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 12px;
                    width: 100%;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fas fa-wrench me-1"></i>
                    Auto-Fix DeepSeek Connection
                </button>
            `;
            
            const testBtn = document.getElementById('testAIBtn');
            if (testBtn) {
                testBtn.parentNode.insertBefore(autoFixBtn, testBtn.nextSibling);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAutoFixButton);
    } else {
        setTimeout(addAutoFixButton, 1000);
    }

    console.log('🛠️ DeepSeek fix utilities loaded');
    console.log('💡 You can also run: testDeepSeekManually() in browser console');

})();