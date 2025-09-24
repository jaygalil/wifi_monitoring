// Advanced AI Features for Site Tracker Dashboard
// Integrates with external AI APIs for enhanced intelligence

class AdvancedAIFeatures {
    constructor() {
        this.apiConfigurations = {
            // Configurable AI API endpoints
            openrouter: {
                endpoint: 'https://openrouter.ai/api/v1/chat/completions',
                model: 'deepseek/deepseek-chat', // Default model
                apiKey: null,
                availableModels: [
                    { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek' },
                    { id: 'deepseek/deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek' },
                    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
                    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
                    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
                    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
                    { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
                    { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', provider: 'Meta' },
                    { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', provider: 'Mistral' },
                    { id: 'microsoft/wizardlm-2-8x22b', name: 'WizardLM 2 8x22B', provider: 'Microsoft' }
                ]
            },
            deepseek: {
                endpoint: 'https://api.deepseek.com/chat/completions',
                model: 'deepseek-chat',
                apiKey: null // To be configured by user
            },
            openai: {
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                apiKey: null // To be configured by user
            },
            anthropic: {
                endpoint: 'https://api.anthropic.com/v1/messages',
                model: 'claude-3-haiku-20240307',
                apiKey: null
            },
            gemini: {
                endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
                apiKey: null
            }
        };
        
        this.currentProvider = 'openrouter'; // Default to OpenRouter
        this.analysisCache = new Map();
        this.predictionModels = {};
        
        this.initializeAdvancedFeatures();
    }

    // Initialize advanced AI features
    initializeAdvancedFeatures() {
        this.addAdvancedUIElements();
        this.initializePredictiveModels();
        this.setupAnalyticsTracking();
        console.log('Advanced AI Features initialized');
    }

    // Add UI elements for advanced AI features
    addAdvancedUIElements() {
        // Add AI configuration panel to sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            const aiConfigHTML = `
                <div class="ai-config-section filter-group" style="border: 2px solid #667eea; border-radius: 12px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);">
                    <h5 style="color: #667eea;"><i class="fas fa-brain me-2"></i>🧠 AI Configuration</h5>
                    
                    <div class="alert alert-info">
                        <small>
                            <strong>Enable Advanced AI:</strong><br>
                            Connect to external AI services for enhanced analysis, natural language queries, and predictions.
                        </small>
                    </div>
                    
                    <label for="aiProvider" style="font-weight: 600; margin-top: 10px;">AI Provider</label>
                    <select class="form-control" id="aiProvider" onchange="advancedAI.changeProvider(this.value)">
                        <option value="local">Local AI (Built-in)</option>
                        <option value="openrouter" selected>OpenRouter (All Models) 🌟</option>
                        <option value="deepseek">DeepSeek Direct</option>
                        <option value="openai">OpenAI Direct</option>
                        <option value="anthropic">Anthropic Direct</option>
                        <option value="gemini">Google Gemini Direct</option>
                    </select>
                    
                    <div id="apiKeySection" style="display: block; margin-top: 10px;">
                        <label for="externalApiKey">API Key</label>
                        <input type="password" class="form-control" id="externalApiKey" placeholder="Enter your OPENROUTER API key">
                        <small class="text-muted">Your API key is stored locally and never shared.</small>
                    </div>
                    
                    <div id="modelSelection" style="display: block; margin-top: 10px;">
                        <label for="aiModelSelect" style="font-weight: 600;">AI Model</label>
                        <select class="form-control" id="aiModelSelect" onchange="advancedAI.changeModel(this.value)">
                            <!-- Models will be populated dynamically -->
                        </select>
                        <small class="text-muted">Choose the AI model that best fits your needs.</small>
                    </div>
                    
                    <div class="ai-features-toggle" style="margin-top: 15px;">
                        <h6 style="color: #667eea; font-size: 14px; margin-bottom: 10px;">✨ Advanced Features</h6>
                        
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="enableNLQ" checked>
                            <label class="form-check-label" for="enableNLQ" style="font-size: 12px;">
                                Natural Language Queries
                            </label>
                        </div>
                        
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="enablePredictions" checked>
                            <label class="form-check-label" for="enablePredictions" style="font-size: 12px;">
                                Predictive Analytics
                            </label>
                        </div>
                        
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="enableAnomalyDetection" checked>
                            <label class="form-check-label" for="enableAnomalyDetection" style="font-size: 12px;">
                                Advanced Anomaly Detection
                            </label>
                        </div>
                        
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="enableAutoInsights" checked>
                            <label class="form-check-label" for="enableAutoInsights" style="font-size: 12px;">
                                Automated Insights
                            </label>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary w-100 mt-3" onclick="advancedAI.testAIConnection()" id="testAIBtn">
                        <i class="fas fa-satellite me-2"></i>Test AI Connection
                    </button>
                    
                    <div id="aiStatus" class="mt-2 text-center" style="display: none;">
                        <small class="text-success">
                            <i class="fas fa-check-circle me-1"></i>
                            AI Connected Successfully
                        </small>
                    </div>
                </div>
            `;
            
            // Insert after the existing API configuration
            const firstFilterGroup = sidebar.querySelector('.filter-group');
            if (firstFilterGroup) {
                firstFilterGroup.insertAdjacentHTML('afterend', aiConfigHTML);
            }
        }
    }

    // Change AI provider
    changeProvider(provider) {
        this.currentProvider = provider;
        const apiKeySection = document.getElementById('apiKeySection');
        const modelSelection = document.getElementById('modelSelection');
        
        if (provider === 'local') {
            apiKeySection.style.display = 'none';
            if (modelSelection) modelSelection.style.display = 'none';
        } else {
            apiKeySection.style.display = 'block';
            const apiKeyInput = document.getElementById('externalApiKey');
            
            if (provider === 'openrouter') {
                apiKeyInput.placeholder = 'Enter your OPENROUTER API key';
                if (modelSelection) {
                    modelSelection.style.display = 'block';
                    this.populateModelOptions();
                }
            } else {
                apiKeyInput.placeholder = `Enter your ${provider.toUpperCase()} API key`;
                if (modelSelection) modelSelection.style.display = 'none';
            }
        }
        
        console.log('AI provider changed to:', provider);
    }
    
    // Change AI model (for OpenRouter)
    changeModel(modelId) {
        if (this.currentProvider === 'openrouter') {
            this.apiConfigurations.openrouter.model = modelId;
            console.log('AI model changed to:', modelId);
        }
    }
    
    // Populate model options for OpenRouter
    populateModelOptions() {
        const modelSelect = document.getElementById('aiModelSelect');
        if (!modelSelect || this.currentProvider !== 'openrouter') return;
        
        const models = this.apiConfigurations.openrouter.availableModels;
        modelSelect.innerHTML = '';
        
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.name} (${model.provider})`;
            if (model.id === this.apiConfigurations.openrouter.model) {
                option.selected = true;
            }
            modelSelect.appendChild(option);
        });
    }

    // Test AI connection
    async testAIConnection() {
        const testBtn = document.getElementById('testAIBtn');
        const statusDiv = document.getElementById('aiStatus');
        
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Testing...';
        
        try {
            if (this.currentProvider === 'local') {
                // Test local AI
                statusDiv.innerHTML = '<small class="text-success"><i class="fas fa-check-circle me-1"></i>Local AI Ready</small>';
                statusDiv.style.display = 'block';
            } else {
                // Test external AI
                const apiKey = document.getElementById('externalApiKey').value;
                if (!apiKey) {
                    throw new Error('Please enter your API key');
                }
                
                const isConnected = await this.testExternalAI(this.currentProvider, apiKey);
                if (isConnected) {
                    this.apiConfigurations[this.currentProvider].apiKey = apiKey;
                    statusDiv.innerHTML = `<small class="text-success"><i class="fas fa-check-circle me-1"></i>${this.currentProvider.toUpperCase()} Connected</small>`;
                    statusDiv.style.display = 'block';
                    
                    // Update main AI assistant with enhanced capabilities
                    if (window.aiAssistant) {
                        window.aiAssistant.externalAI = this;
                    }
                } else {
                    throw new Error('Connection failed');
                }
            }
        } catch (error) {
            statusDiv.innerHTML = `<small class="text-danger"><i class="fas fa-exclamation-triangle me-1"></i>${error.message}</small>`;
            statusDiv.style.display = 'block';
        }
        
        testBtn.disabled = false;
        testBtn.innerHTML = '<i class="fas fa-satellite me-2"></i>Test AI Connection';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }

    // Test external AI connection
    async testExternalAI(provider, apiKey) {
        try {
            const testMessage = "Hello, please respond with: Connection successful";
            const response = await this.callExternalAI(provider, testMessage, apiKey);
            console.log('AI Test Response:', response);
            return response && (response.includes('successful') || response.includes('Connection') || response.length > 5);
        } catch (error) {
            console.error('AI connection test failed:', error);
            console.error('Error details:', error.message);
            return false;
        }
    }

    // Call external AI API
    async callExternalAI(provider, message, apiKey = null) {
        const key = apiKey || this.apiConfigurations[provider].apiKey;
        if (!key) {
            throw new Error('API key not configured');
        }

        let requestBody, headers, url;

        switch (provider) {
            case 'openrouter':
                url = this.apiConfigurations.openrouter.endpoint;
                headers = {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Site Tracker Dashboard'
                };
                requestBody = {
                    model: this.apiConfigurations.openrouter.model,
                    messages: [{ role: 'user', content: message }],
                    max_tokens: 1000,
                    temperature: 0.7
                };
                break;
                
            case 'deepseek':
                url = this.apiConfigurations.deepseek.endpoint;
                headers = {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                };
                requestBody = {
                    model: this.apiConfigurations.deepseek.model,
                    messages: [{ role: 'user', content: message }],
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: false
                };
                break;

            case 'openai':
                url = this.apiConfigurations.openai.endpoint;
                headers = {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                };
                requestBody = {
                    model: this.apiConfigurations.openai.model,
                    messages: [{ role: 'user', content: message }],
                    max_tokens: 1000,
                    temperature: 0.7
                };
                break;

            case 'anthropic':
                url = this.apiConfigurations.anthropic.endpoint;
                headers = {
                    'x-api-key': key,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                };
                requestBody = {
                    model: this.apiConfigurations.anthropic.model,
                    max_tokens: 1000,
                    messages: [{ role: 'user', content: message }]
                };
                break;

            case 'gemini':
                url = `${this.apiConfigurations.gemini.endpoint}?key=${key}`;
                headers = {
                    'Content-Type': 'application/json'
                };
                requestBody = {
                    contents: [{ parts: [{ text: message }] }]
                };
                break;

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }

        console.log('API Request:', { url, headers: { ...headers, 'Authorization': '[HIDDEN]' }, requestBody });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        console.log('API Response Status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response Data:', data);
        return this.extractResponseText(provider, data);
    }

    // Extract response text based on provider
    extractResponseText(provider, data) {
        switch (provider) {
            case 'openrouter':
                return data.choices?.[0]?.message?.content || 'No response';
            case 'deepseek':
                return data.choices?.[0]?.message?.content || 'No response';
            case 'openai':
                return data.choices?.[0]?.message?.content || 'No response';
            case 'anthropic':
                return data.content?.[0]?.text || 'No response';
            case 'gemini':
                return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
            default:
                return 'Unknown provider response format';
        }
    }

    // Enhanced natural language query processing
    async processNaturalLanguageQuery(query, data) {
        if (this.currentProvider === 'local') {
            return this.processQueryLocally(query, data);
        } else {
            return this.processQueryWithExternalAI(query, data);
        }
    }

    // Process query locally using built-in logic
    processQueryLocally(query, data) {
        const lowerQuery = query.toLowerCase();
        
        // Enhanced local processing with more sophisticated pattern matching
        const queryPatterns = {
            performance: /performance|speed|latency|bandwidth|throughput/i,
            location: /location|region|province|district|lgu|where|geographic/i,
            connectivity: /connect|connection|link|network|internet|outage/i,
            technology: /tech|technology|fiber|vsat|leo|satellite/i,
            provider: /provider|isp|company|operator/i,
            issues: /issue|problem|error|fault|down|offline|trouble/i,
            statistics: /stat|statistics|count|total|average|summary/i,
            trends: /trend|pattern|increase|decrease|growth|change/i
        };

        let analysisType = 'general';
        let matchedPattern = '';

        for (const [type, pattern] of Object.entries(queryPatterns)) {
            if (pattern.test(query)) {
                analysisType = type;
                matchedPattern = type;
                break;
            }
        }

        return this.generateLocalAnalysis(analysisType, query, data, matchedPattern);
    }

    // Generate local analysis based on query type
    generateLocalAnalysis(type, query, data, pattern) {
        const analysis = {
            queryType: type,
            pattern: pattern,
            results: [],
            insights: [],
            recommendations: []
        };

        switch (type) {
            case 'performance':
                analysis.results = this.analyzePerformanceData(data);
                break;
            case 'location':
                analysis.results = this.analyzeLocationData(data);
                break;
            case 'connectivity':
                analysis.results = this.analyzeConnectivityData(data);
                break;
            case 'technology':
                analysis.results = this.analyzeTechnologyData(data);
                break;
            case 'provider':
                analysis.results = this.analyzeProviderData(data);
                break;
            case 'issues':
                analysis.results = this.detectIssuesInData(data);
                break;
            case 'statistics':
                analysis.results = this.generateStatistics(data);
                break;
            case 'trends':
                analysis.results = this.analyzeTrends(data);
                break;
            default:
                analysis.results = this.generateGeneralAnalysis(data);
        }

        return this.formatAnalysisResponse(analysis, query);
    }

    // Analyze performance data
    analyzePerformanceData(data) {
        // Look for performance-related fields
        const performanceFields = [];
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            performanceFields.push(...headers.filter(h => 
                h.toLowerCase().includes('speed') ||
                h.toLowerCase().includes('bandwidth') ||
                h.toLowerCase().includes('latency') ||
                h.toLowerCase().includes('performance')
            ));
        }

        return {
            type: 'performance',
            fields: performanceFields,
            summary: `Found ${performanceFields.length} performance-related fields in your data`,
            details: performanceFields.length > 0 ? 
                `Performance metrics available: ${performanceFields.join(', ')}` :
                'No specific performance metrics detected in the current dataset'
        };
    }

    // Analyze location data
    analyzeLocationData(data) {
        const locationFields = [];
        const uniqueLocations = new Set();
        
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            locationFields.push(...headers.filter(h => 
                h.toLowerCase().includes('location') ||
                h.toLowerCase().includes('address') ||
                h.toLowerCase().includes('province') ||
                h.toLowerCase().includes('district') ||
                h.toLowerCase().includes('lgu') ||
                h.toLowerCase().includes('region')
            ));

            // Count unique locations
            locationFields.forEach(field => {
                data.forEach(record => {
                    if (record[field]) {
                        uniqueLocations.add(record[field]);
                    }
                });
            });
        }

        return {
            type: 'location',
            fields: locationFields,
            uniqueCount: uniqueLocations.size,
            summary: `Geographic data spans ${uniqueLocations.size} unique locations`,
            details: `Location fields: ${locationFields.join(', ')}`
        };
    }

    // Process query with external AI
    async processQueryWithExternalAI(query, data) {
        try {
            const dataContext = this.prepareDataContextForAI(data);
            const enhancedPrompt = `
You are an AI assistant for a Site Tracker dashboard analyzing network infrastructure data in Philippines Region 2.

User Query: "${query}"

Data Context:
${dataContext}

Please provide a comprehensive analysis addressing the user's query. Include:
1. Direct answer to the question
2. Key insights from the data
3. Actionable recommendations
4. Data visualizations suggestions if applicable

Format your response in a clear, structured manner with bullet points and sections.
            `;

            const response = await this.callExternalAI(this.currentProvider, enhancedPrompt);
            return {
                source: 'external_ai',
                provider: this.currentProvider,
                response: response,
                enhanced: true
            };

        } catch (error) {
            console.error('External AI processing failed:', error);
            // Fallback to local processing
            return this.processQueryLocally(query, data);
        }
    }

    // Prepare data context for AI
    prepareDataContextForAI(data) {
        if (!data || data.length === 0) {
            return "No data currently loaded.";
        }

        const sampleSize = Math.min(5, data.length);
        const sample = data.slice(0, sampleSize);
        const headers = Object.keys(data[0]).filter(key => key !== '_originalIndex');

        return `
Dataset Summary:
- Total Records: ${data.length}
- Data Fields: ${headers.join(', ')}
- Sample Data (first ${sampleSize} records): ${JSON.stringify(sample, null, 2)}
        `;
    }

    // Format analysis response
    formatAnalysisResponse(analysis, originalQuery) {
        let response = `🔍 **Analysis Results for: "${originalQuery}"**\n\n`;
        
        if (analysis.results) {
            response += `📊 **Findings:**\n`;
            if (analysis.results.summary) {
                response += `${analysis.results.summary}\n\n`;
            }
            if (analysis.results.details) {
                response += `**Details:** ${analysis.results.details}\n\n`;
            }
        }

        if (analysis.insights && analysis.insights.length > 0) {
            response += `💡 **Insights:**\n${analysis.insights.join('\n')}\n\n`;
        }

        if (analysis.recommendations && analysis.recommendations.length > 0) {
            response += `🚀 **Recommendations:**\n${analysis.recommendations.join('\n')}\n`;
        }

        return response;
    }

    // Initialize predictive models
    initializePredictiveModels() {
        // Simple linear regression for trend prediction
        this.predictionModels.trendPredictor = {
            predict: (values) => {
                if (values.length < 2) return null;
                
                const n = values.length;
                const sumX = values.reduce((sum, _, i) => sum + i, 0);
                const sumY = values.reduce((sum, val) => sum + val, 0);
                const sumXY = values.reduce((sum, val, i) => sum + (i * val), 0);
                const sumXX = values.reduce((sum, _, i) => sum + (i * i), 0);
                
                const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
                const intercept = (sumY - slope * sumX) / n;
                
                return { slope, intercept, nextValue: slope * n + intercept };
            }
        };

        console.log('Predictive models initialized');
    }

    // Detect advanced anomalies
    detectAdvancedAnomalies(data) {
        const anomalies = [];
        
        if (!data || data.length === 0) return anomalies;

        // Statistical anomaly detection
        const numericFields = this.identifyNumericFields(data);
        
        numericFields.forEach(field => {
            const values = data.map(record => parseFloat(record[field])).filter(v => !isNaN(v));
            if (values.length === 0) return;

            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
            
            // Z-score based outlier detection
            const outliers = values.filter(val => Math.abs(val - mean) > 2 * stdDev);
            
            if (outliers.length > 0) {
                anomalies.push({
                    type: 'statistical_outlier',
                    field: field,
                    count: outliers.length,
                    severity: outliers.length > values.length * 0.1 ? 'high' : 'medium',
                    description: `${outliers.length} statistical outliers detected in ${field}`
                });
            }
        });

        // Pattern-based anomalies
        const patterns = this.detectPatternAnomalies(data);
        anomalies.push(...patterns);

        return anomalies;
    }

    // Identify numeric fields
    identifyNumericFields(data) {
        if (data.length === 0) return [];
        
        const headers = Object.keys(data[0]).filter(key => key !== '_originalIndex');
        return headers.filter(header => {
            const sampleValues = data.slice(0, Math.min(10, data.length));
            const numericCount = sampleValues.filter(record => {
                const value = record[header];
                return !isNaN(parseFloat(value)) && isFinite(value);
            }).length;
            
            return numericCount > sampleValues.length * 0.7; // 70% numeric threshold
        });
    }

    // Detect pattern anomalies
    detectPatternAnomalies(data) {
        const patterns = [];
        
        // Check for duplicate entries
        const seen = new Set();
        let duplicates = 0;
        
        data.forEach(record => {
            const recordString = JSON.stringify(record);
            if (seen.has(recordString)) {
                duplicates++;
            } else {
                seen.add(recordString);
            }
        });

        if (duplicates > 0) {
            patterns.push({
                type: 'duplicate_records',
                count: duplicates,
                severity: 'medium',
                description: `${duplicates} duplicate records detected`
            });
        }

        return patterns;
    }

    // Setup analytics tracking
    setupAnalyticsTracking() {
        this.analyticsData = {
            queryCount: 0,
            queryTypes: {},
            aiUsage: {
                local: 0,
                external: 0
            },
            startTime: new Date()
        };
    }

    // Track AI usage
    trackAIUsage(provider, queryType) {
        this.analyticsData.queryCount++;
        this.analyticsData.queryTypes[queryType] = (this.analyticsData.queryTypes[queryType] || 0) + 1;
        
        if (provider === 'local') {
            this.analyticsData.aiUsage.local++;
        } else {
            this.analyticsData.aiUsage.external++;
        }
    }

    // Generate usage analytics
    getUsageAnalytics() {
        const uptime = new Date() - this.analyticsData.startTime;
        return {
            totalQueries: this.analyticsData.queryCount,
            queryTypes: this.analyticsData.queryTypes,
            aiUsage: this.analyticsData.aiUsage,
            uptimeMinutes: Math.round(uptime / (1000 * 60)),
            averageQueriesPerMinute: this.analyticsData.queryCount / Math.max(1, uptime / (1000 * 60))
        };
    }

    // Generate AI-powered insights
    async generateAutomatedInsights(data) {
        if (!document.getElementById('enableAutoInsights').checked) {
            return null;
        }

        const insights = [];
        
        // Data quality insights
        const qualityScore = this.calculateDataQuality(data);
        insights.push(`📊 Data Quality Score: ${qualityScore}%`);
        
        // Geographic distribution insights
        const geoInsights = this.analyzeGeographicDistribution(data);
        if (geoInsights) {
            insights.push(geoInsights);
        }
        
        // Trend insights
        const trendInsights = this.identifyTrends(data);
        if (trendInsights) {
            insights.push(trendInsights);
        }

        return insights;
    }

    // Calculate data quality score
    calculateDataQuality(data) {
        if (!data || data.length === 0) return 0;
        
        let totalFields = 0;
        let filledFields = 0;
        
        data.forEach(record => {
            Object.keys(record).forEach(key => {
                if (key !== '_originalIndex') {
                    totalFields++;
                    if (record[key] && record[key].toString().trim() !== '') {
                        filledFields++;
                    }
                }
            });
        });
        
        return Math.round((filledFields / totalFields) * 100);
    }

    // Additional helper methods for comprehensive analysis
    generateStatistics(data) {
        if (!data || data.length === 0) {
            return { summary: "No data available for statistical analysis" };
        }

        const stats = {
            totalRecords: data.length,
            fields: Object.keys(data[0]).filter(key => key !== '_originalIndex').length,
            completeness: this.calculateDataQuality(data)
        };

        return {
            summary: `Statistical Overview: ${stats.totalRecords} records across ${stats.fields} fields with ${stats.completeness}% data completeness`,
            details: `Data contains comprehensive information suitable for analysis and reporting`
        };
    }

    analyzeTrends(data) {
        // Simple trend analysis based on timestamps or sequential data
        return {
            summary: "Trend analysis requires time-series data",
            details: "Consider adding timestamp fields to enable comprehensive trend analysis"
        };
    }

    generateGeneralAnalysis(data) {
        return {
            summary: `General dataset analysis: ${data.length} total records available`,
            details: "Dataset is ready for filtering, mapping, and detailed analysis through the dashboard interface"
        };
    }

    analyzeConnectivityData(data) {
        // Look for connectivity-related fields
        const connectivityFields = [];
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            connectivityFields.push(...headers.filter(h => 
                h.toLowerCase().includes('connect') ||
                h.toLowerCase().includes('link') ||
                h.toLowerCase().includes('network') ||
                h.toLowerCase().includes('status')
            ));
        }

        return {
            type: 'connectivity',
            fields: connectivityFields,
            summary: `Connectivity analysis across ${connectivityFields.length} related fields`,
            details: connectivityFields.length > 0 ? 
                `Connectivity fields: ${connectivityFields.join(', ')}` :
                'No specific connectivity fields detected'
        };
    }

    analyzeTechnologyData(data) {
        const techFields = [];
        const technologies = new Set();
        
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            techFields.push(...headers.filter(h => 
                h.toLowerCase().includes('tech') ||
                h.toLowerCase().includes('type') ||
                h.toLowerCase().includes('service')
            ));

            techFields.forEach(field => {
                data.forEach(record => {
                    if (record[field]) {
                        technologies.add(record[field]);
                    }
                });
            });
        }

        return {
            type: 'technology',
            fields: techFields,
            uniqueTechnologies: technologies.size,
            summary: `Technology analysis reveals ${technologies.size} different technology types`,
            details: `Technologies detected: ${Array.from(technologies).join(', ')}`
        };
    }

    analyzeProviderData(data) {
        const providerFields = [];
        const providers = new Set();
        
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            providerFields.push(...headers.filter(h => 
                h.toLowerCase().includes('provider') ||
                h.toLowerCase().includes('company') ||
                h.toLowerCase().includes('operator')
            ));

            providerFields.forEach(field => {
                data.forEach(record => {
                    if (record[field]) {
                        providers.add(record[field]);
                    }
                });
            });
        }

        return {
            type: 'provider',
            fields: providerFields,
            uniqueProviders: providers.size,
            summary: `Provider analysis shows ${providers.size} different service providers`,
            details: `Providers: ${Array.from(providers).join(', ')}`
        };
    }

    detectIssuesInData(data) {
        const issues = [];
        
        // Check for missing coordinates
        let missingCoords = 0;
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            const latField = headers.find(h => h.toLowerCase().includes('lat'));
            const lngField = headers.find(h => h.toLowerCase().includes('lng') || h.toLowerCase().includes('long'));
            
            if (latField && lngField) {
                data.forEach(record => {
                    const lat = parseFloat(record[latField]);
                    const lng = parseFloat(record[lngField]);
                    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                        missingCoords++;
                    }
                });
            }
        }

        return {
            type: 'issues',
            summary: `Issue detection complete: ${missingCoords} records with coordinate issues`,
            details: missingCoords > 0 ? 
                `${missingCoords} records have missing or invalid coordinates` :
                'No major data quality issues detected'
        };
    }
}

// Initialize Advanced AI Features
const advancedAI = new AdvancedAIFeatures();

// Make it globally available
window.advancedAI = advancedAI;

// Extend the main AI assistant with advanced capabilities
if (window.aiAssistant) {
    window.aiAssistant.advancedFeatures = advancedAI;
    
    // Override the processMessage method to use advanced features
    const originalProcessMessage = window.aiAssistant.processMessage;
    window.aiAssistant.processMessage = async function(message) {
        // Check if advanced features are enabled and configured
        if (advancedAI.currentProvider !== 'local' && advancedAI.apiConfigurations[advancedAI.currentProvider].apiKey) {
            try {
                const enhancedResponse = await advancedAI.processNaturalLanguageQuery(message, this.currentData);
                if (enhancedResponse.enhanced) {
                    advancedAI.trackAIUsage(enhancedResponse.provider, 'external');
                    return enhancedResponse.response;
                }
            } catch (error) {
                console.log('Advanced AI failed, falling back to local processing:', error);
            }
        }
        
        // Fallback to original processing
        advancedAI.trackAIUsage('local', 'local');
        return originalProcessMessage.call(this, message);
    };
}

console.log('🧠 Advanced AI Features loaded and integrated successfully!');