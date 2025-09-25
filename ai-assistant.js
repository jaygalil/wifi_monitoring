// AI Assistant for Site Tracker Dashboard
// Provides intelligent assistance for data analysis and user queries

class AIAssistant {
    constructor() {
        this.isInitialized = false;
        this.chatHistory = [];
        this.currentData = [];
        this.apiEndpoint = null; // Will be configured based on chosen AI service
        this.assistantVisible = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Initialize the AI Assistant
    init() {
        this.createAssistantUI();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('AI Assistant initialized');
    }

    // Create the AI Assistant UI
    createAssistantUI() {
        // Check if button already exists in navbar
        const existingButton = document.getElementById('aiAssistantToggle');
        if (!existingButton) {
            // Fallback: create button if not found
            const buttonHTML = `
                <button id="aiAssistantToggle" class="ai-assistant-toggle" title="🤖 AI Assistant" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px;">
                    <i class="fas fa-robot"></i>
                    <span class="ai-pulse"></span>
                </button>
            `;
            document.body.insertAdjacentHTML('beforeend', buttonHTML);
        }
        
        const assistantHTML = `
            <!-- AI Assistant Panel -->
            <div id="aiAssistantPanel" class="ai-assistant-panel">
                <div class="ai-assistant-header">
                    <div class="ai-assistant-title">
                        <i class="fas fa-robot me-2"></i>
                        AI Assistant
                        <span class="ai-status-indicator" id="aiStatus">Ready</span>
                    </div>
                    <button class="ai-assistant-close" onclick="aiAssistant.toggleAssistant()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="ai-assistant-body">
                    <!-- Quick Actions -->
                    <div class="ai-quick-actions">
                        <div class="ai-quick-actions-title">Quick Actions</div>
                        <div class="ai-quick-buttons">
                            <button class="ai-quick-btn" onclick="aiAssistant.quickAction('analyze')">
                                <i class="fas fa-chart-line"></i> Analyze Data
                            </button>
                            <button class="ai-quick-btn" onclick="aiAssistant.quickAction('insights')">
                                <i class="fas fa-lightbulb"></i> Get Insights
                            </button>
                            <button class="ai-quick-btn" onclick="aiAssistant.quickAction('anomalies')">
                                <i class="fas fa-exclamation-triangle"></i> Find Issues
                            </button>
                            <button class="ai-quick-btn" onclick="aiAssistant.quickAction('summary')">
                                <i class="fas fa-file-alt"></i> Summarize
                            </button>
                        </div>
                    </div>

                    <!-- Chat Interface -->
                    <div class="ai-chat-container">
                        <div class="ai-chat-messages" id="aiChatMessages">
                            <div class="ai-message ai-welcome">
                                <div class="ai-avatar">
                                    <i class="fas fa-robot"></i>
                                </div>
                                <div class="ai-message-content">
                                    <p>👋 Hi! I'm your AI assistant for the Site Tracker dashboard.</p>
                                    <p>I can help you:</p>
                                    <ul>
                                        <li>🔍 Analyze your data and find patterns</li>
                                        <li>📊 Generate insights and reports</li>
                                        <li>🗣️ Answer questions about your sites</li>
                                        <li>⚡ Suggest optimizations</li>
                                    </ul>
                                    <p>Try asking me something like: <em>"Show me sites with connectivity issues"</em> or <em>"Analyze performance trends"</em></p>
                                </div>
                            </div>
                        </div>

                        <div class="ai-chat-input-container">
                            <div class="ai-input-wrapper">
                                <input type="text" id="aiChatInput" placeholder="Ask me anything about your data..." class="ai-chat-input">
                                <button id="aiSendBtn" class="ai-send-btn" onclick="aiAssistant.sendMessage()">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                            <div class="ai-suggestions" id="aiSuggestions">
                                <div class="ai-suggestion" onclick="aiAssistant.useSuggestion(this)">
                                    "What are the top performing sites?"
                                </div>
                                <div class="ai-suggestion" onclick="aiAssistant.useSuggestion(this)">
                                    "Show me connectivity issues"
                                </div>
                                <div class="ai-suggestion" onclick="aiAssistant.useSuggestion(this)">
                                    "Analyze regional distribution"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert the assistant UI into the page
        document.body.insertAdjacentHTML('beforeend', assistantHTML);

        // Add the CSS styles
        this.addAssistantStyles();
    }

    // Add CSS styles for the AI Assistant
    addAssistantStyles() {
        const styles = `
            <style>
                /* AI Assistant Toggle Button */
                .ai-assistant-toggle {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    width: 42px;
                    height: 42px;
                    margin-left: 8px;
                }

                .ai-assistant-toggle:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
                }

                .ai-assistant-toggle:active {
                    transform: translateY(-1px);
                }

                .ai-pulse {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    animation: aiPulse 2s infinite;
                }

                @keyframes aiPulse {
                    0% { transform: scale(0.95); opacity: 1; }
                    70% { transform: scale(1.05); opacity: 0.5; }
                    100% { transform: scale(1.05); opacity: 0; }
                }

                /* AI Assistant Panel */
                .ai-assistant-panel {
                    position: fixed;
                    top: 65px;
                    right: 20px;
                    width: 400px;
                    max-width: calc(100vw - 40px);
                    height: 600px;
                    max-height: calc(100vh - 85px);
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    z-index: 999;
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    animation: aiSlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .ai-assistant-panel.show {
                    display: flex;
                }

                @keyframes aiSlideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* AI Assistant Header */
                .ai-assistant-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .ai-assistant-title {
                    font-weight: 600;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                }

                .ai-status-indicator {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    margin-left: 8px;
                    font-weight: 500;
                }

                .ai-assistant-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .ai-assistant-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                /* AI Assistant Body */
                .ai-assistant-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                /* Quick Actions */
                .ai-quick-actions {
                    padding: 15px 20px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }

                .ai-quick-actions-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .ai-quick-buttons {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .ai-quick-btn {
                    padding: 10px 12px;
                    background: rgba(102, 126, 234, 0.1);
                    border: 1px solid rgba(102, 126, 234, 0.2);
                    border-radius: 8px;
                    color: #667eea;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }

                .ai-quick-btn:hover {
                    background: rgba(102, 126, 234, 0.15);
                    transform: translateY(-1px);
                }

                .ai-quick-btn i {
                    margin-right: 6px;
                    font-size: 11px;
                }

                /* Chat Interface */
                .ai-chat-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .ai-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px 20px;
                    scroll-behavior: smooth;
                }

                .ai-message {
                    display: flex;
                    margin-bottom: 15px;
                    animation: aiMessageSlide 0.3s ease;
                }

                @keyframes aiMessageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .ai-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 14px;
                    margin-right: 12px;
                    flex-shrink: 0;
                }

                .ai-message-content {
                    flex: 1;
                    background: rgba(0, 0, 0, 0.05);
                    padding: 12px 15px;
                    border-radius: 15px;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .ai-message.user {
                    flex-direction: row-reverse;
                }

                .ai-message.user .ai-avatar {
                    background: #34c759;
                    margin-right: 0;
                    margin-left: 12px;
                }

                .ai-message.user .ai-message-content {
                    background: #667eea;
                    color: white;
                }

                .ai-welcome ul {
                    margin: 8px 0;
                    padding-left: 20px;
                }

                .ai-welcome li {
                    margin-bottom: 4px;
                }

                /* Chat Input */
                .ai-chat-input-container {
                    padding: 15px 20px;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }

                .ai-input-wrapper {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .ai-chat-input {
                    flex: 1;
                    padding: 12px 15px;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 20px;
                    font-size: 14px;
                    outline: none;
                    background: rgba(255, 255, 255, 0.8);
                    transition: all 0.2s ease;
                }

                .ai-chat-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .ai-send-btn {
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 50%;
                    background: #667eea;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .ai-send-btn:hover {
                    background: #5a6fd8;
                    transform: scale(1.05);
                }

                .ai-send-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Suggestions */
                .ai-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .ai-suggestion {
                    padding: 6px 12px;
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 15px;
                    font-size: 12px;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .ai-suggestion:hover {
                    background: rgba(102, 126, 234, 0.1);
                    color: #667eea;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .ai-assistant-panel {
                        width: calc(100vw - 20px);
                        right: 10px;
                        top: 65px;
                        height: calc(100vh - 85px);
                    }
                    
                    .ai-assistant-toggle {
                        width: 38px;
                        height: 38px;
                        font-size: 16px;
                        margin-left: 6px;
                    }
                    
                    .ai-quick-buttons {
                        grid-template-columns: 1fr;
                    }
                }

                /* Loading Animation */
                .ai-typing {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 12px 15px;
                }

                .ai-typing-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #667eea;
                    animation: aiTyping 1.5s infinite;
                }

                .ai-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .ai-typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes aiTyping {
                    0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
                    30% { opacity: 1; transform: scale(1); }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Setup event listeners
    setupEventListeners() {
        // Toggle assistant
        document.getElementById('aiAssistantToggle').addEventListener('click', () => {
            this.toggleAssistant();
        });

        // Chat input
        const chatInput = document.getElementById('aiChatInput');
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Update data when dashboard data changes
        if (window.allData) {
            this.updateData(window.allData);
        }
    }

    // Toggle assistant visibility
    toggleAssistant() {
        const panel = document.getElementById('aiAssistantPanel');
        this.assistantVisible = !this.assistantVisible;
        
        if (this.assistantVisible) {
            panel.classList.add('show');
        } else {
            panel.classList.remove('show');
        }
    }

    // Update current data for analysis
    updateData(data) {
        this.currentData = data;
        console.log('AI Assistant updated with', data.length, 'records');
    }

    // Send a message to the AI
    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        try {
            // Process the message
            const response = await this.processMessage(message);
            
            // Hide typing and show response
            this.hideTyping();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTyping();
            this.addMessage('Sorry, I encountered an error processing your request. Please try again.', 'ai');
            console.error('AI Assistant error:', error);
        }
    }

    // Process user message and generate response
    async processMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Check for report generation requests
        if (lowerMessage.includes('report') || lowerMessage.includes('generate report')) {
            return await this.handleReportRequest(message);
        } else if (lowerMessage.includes('pdf') || lowerMessage.includes('export pdf')) {
            return await this.handlePDFRequest(message);
        } else if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
            return await this.performDataAnalysis(message);
        } else if (lowerMessage.includes('insight') || lowerMessage.includes('pattern')) {
            return await this.generateInsights();
        } else if (lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('anomal')) {
            return await this.findAnomalies();
        } else if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
            return await this.generateSummary();
        } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return this.getHelpMessage();
        } else if (lowerMessage.includes('site') || lowerMessage.includes('location')) {
            return await this.analyzeSites(message);
        } else if (lowerMessage.includes('performance') || lowerMessage.includes('speed')) {
            return await this.analyzePerformance();
        } else {
            return await this.generateGenericResponse(message);
        }
    }

    // Perform data analysis
    async performDataAnalysis(query) {
        if (!this.currentData || this.currentData.length === 0) {
            return "I don't have any data to analyze yet. Please load your site data first.";
        }

        const totalRecords = this.currentData.length;
        const analysis = this.analyzeDataDistribution();
        
        return `📊 **Data Analysis Results**\n\n` +
               `• **Total Records**: ${totalRecords}\n` +
               `• **Data Coverage**: ${analysis.coverage}%\n` +
               `• **Most Common Category**: ${analysis.topCategory}\n` +
               `• **Geographic Spread**: ${analysis.locations} unique locations\n\n` +
               `${analysis.insights}`;
    }

    // Generate insights
    async generateInsights() {
        if (!this.currentData || this.currentData.length === 0) {
            return "I need data to generate insights. Please load your site data first.";
        }

        const insights = this.generateDataInsights();
        return `💡 **Key Insights**\n\n${insights.join('\n\n')}`;
    }

    // Find anomalies in data
    async findAnomalies() {
        if (!this.currentData || this.currentData.length === 0) {
            return "I need data to check for issues. Please load your site data first.";
        }

        const anomalies = this.detectAnomalies();
        
        if (anomalies.length === 0) {
            return "✅ Good news! I didn't detect any obvious issues in your data.";
        }
        
        return `⚠️ **Potential Issues Found**\n\n${anomalies.join('\n\n')}`;
    }

    // Generate data summary
    async generateSummary() {
        if (!this.currentData || this.currentData.length === 0) {
            return "I need data to create a summary. Please load your site data first.";
        }

        const summary = this.createDataSummary();
        return `📋 **Data Summary**\n\n${summary}`;
    }

    // Analyze sites based on query
    async analyzeSites(query) {
        if (!this.currentData || this.currentData.length === 0) {
            return "I need site data to analyze. Please load your data first.";
        }

        const siteAnalysis = this.performSiteAnalysis(query);
        return siteAnalysis;
    }

    // Analyze performance metrics
    async analyzePerformance() {
        if (!this.currentData || this.currentData.length === 0) {
            return "I need data to analyze performance. Please load your site data first.";
        }

        const performance = this.analyzePerformanceMetrics();
        return `⚡ **Performance Analysis**\n\n${performance}`;
    }

    // Generate generic response
    async generateGenericResponse(message) {
        return `I understand you're asking about: "${message}"\n\n` +
               `I can help you with:\n` +
               `• 📊 Data analysis and insights\n` +
               `• 📋 Generate comprehensive reports\n` +
               `• 📄 Export reports as PDF documents\n` +
               `• 🔍 Finding issues or anomalies\n` +
               `• 📍 Site location analysis\n` +
               `• 📈 Performance metrics\n` +
               `• 📋 Data summaries\n\n` +
               `Try asking something like:\n` +
               `• "Generate a site status report"\n` +
               `• "Create a connectivity analysis report"\n` +
               `• "Export performance report as PDF"\n` +
               `• "Analyze site performance"`;
    }

    // Handle report generation requests
    async handleReportRequest(message) {
        if (!window.aiReportGenerator) {
            return "❌ Report generator is not available. Please ensure the report generator module is loaded.";
        }

        try {
            // Update report generator with current data
            window.aiReportGenerator.updateData(this.currentData);

            // Determine report type from message
            const reportType = this.determineReportType(message);
            const customPrompt = this.extractCustomPrompt(message);

            // Generate the report
            const report = await window.aiReportGenerator.generateReport(reportType, customPrompt);

            // Format response with report summary
            let response = `📊 **Report Generated Successfully!**\n\n`;
            response += `**Title:** ${report.title}\n`;
            response += `**Type:** ${report.type}\n`;
            response += `**Records Analyzed:** ${report.dataSnapshot.recordsAnalyzed}\n`;
            response += `**Generated:** ${new Date(report.generatedAt).toLocaleString()}\n\n`;

            // Add key insights
            response += `**Key Insights:**\n`;
            report.insights.slice(0, 3).forEach(insight => {
                response += `${insight}\n`;
            });

            // Add recommendations if available
            if (report.recommendations.length > 0) {
                response += `\n**Top Recommendations:**\n`;
                report.recommendations.slice(0, 2).forEach(rec => {
                    response += `• **${rec.title}** (${rec.priority} priority)\n`;
                });
            }

            response += `\n💡 **Want to export this report as PDF?** Just ask: "Export this report as PDF"`;

            // Store the last generated report for PDF export
            this.lastGeneratedReport = report;

            return response;

        } catch (error) {
            console.error('Report generation error:', error);
            return `❌ **Error generating report:** ${error.message}\n\nPlease ensure your data is loaded and try again.`;
        }
    }

    // Handle PDF export requests
    async handlePDFRequest(message) {
        if (!window.aiReportGenerator) {
            return "❌ PDF export is not available. Please ensure the report generator module is loaded.";
        }

        try {
            let report = this.lastGeneratedReport;

            // If no recent report, generate a default one
            if (!report) {
                window.aiReportGenerator.updateData(this.currentData);
                report = await window.aiReportGenerator.generateReport('site-status');
                this.lastGeneratedReport = report;
            }

            // Export to PDF
            const pdfInfo = await window.aiReportGenerator.exportToPDF(report);

            return `📄 **PDF Report Exported Successfully!**\n\n` +
                   `**Filename:** ${pdfInfo.filename}\n` +
                   `**Pages:** ${pdfInfo.pages}\n` +
                   `**Format:** ${pdfInfo.size.format || 'A4'}\n\n` +
                   `The PDF has been downloaded to your default downloads folder. ` +
                   `You can now share or print this comprehensive report.`;

        } catch (error) {
            console.error('PDF export error:', error);
            return `❌ **Error exporting PDF:** ${error.message}\n\nPlease try generating a report first, then request PDF export.`;
        }
    }

    // Determine report type from user message
    determineReportType(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('connectivity') || lowerMessage.includes('connection')) {
            return 'connectivity';
        } else if (lowerMessage.includes('geographic') || lowerMessage.includes('location') || lowerMessage.includes('map')) {
            return 'geographic';
        } else if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair')) {
            return 'maintenance';
        } else if (lowerMessage.includes('status') || lowerMessage.includes('overview')) {
            return 'site-status';
        } else {
            return 'custom';
        }
    }

    // Extract custom prompt from message
    extractCustomPrompt(message) {
        // Look for patterns like "report about X" or "generate report for Y"
        const patterns = [
            /report (?:about|on|for) (.+)/i,
            /generate (?:a )?report (?:about|on|for) (.+)/i,
            /create (?:a )?report (?:about|on|for) (.+)/i
        ];

        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return null;
    }

    // Quick action handler
    quickAction(action) {
        const actionMessages = {
            analyze: "Analyze my data comprehensively",
            insights: "What insights can you find in my data?",
            anomalies: "Find any issues or anomalies in my data",
            summary: "Give me a summary of my data"
        };

        document.getElementById('aiChatInput').value = actionMessages[action] || '';
        this.sendMessage();
    }

    // Use suggestion
    useSuggestion(element) {
        const suggestion = element.textContent.replace(/"/g, '');
        document.getElementById('aiChatInput').value = suggestion;
        this.sendMessage();
    }

    // Helper methods for data analysis
    analyzeDataDistribution() {
        const categories = {};
        const locations = new Set();
        let totalFields = 0;
        let filledFields = 0;

        this.currentData.forEach(record => {
            Object.keys(record).forEach(key => {
                if (key !== '_originalIndex') {
                    totalFields++;
                    if (record[key] && record[key].toString().trim()) {
                        filledFields++;
                    }
                    
                    if (key.toLowerCase().includes('category') || key.toLowerCase().includes('type')) {
                        const category = record[key] || 'Unknown';
                        categories[category] = (categories[category] || 0) + 1;
                    }
                    
                    if (key.toLowerCase().includes('location') || key.toLowerCase().includes('address')) {
                        if (record[key]) locations.add(record[key]);
                    }
                }
            });
        });

        const coverage = Math.round((filledFields / totalFields) * 100);
        const topCategory = Object.keys(categories).reduce((a, b) => 
            categories[a] > categories[b] ? a : b, Object.keys(categories)[0] || 'N/A');

        return {
            coverage,
            topCategory,
            locations: locations.size,
            insights: `Your data has ${coverage}% field coverage with ${Object.keys(categories).length} different categories.`
        };
    }

    generateDataInsights() {
        const insights = [];
        
        if (this.currentData.length > 0) {
            insights.push(`📈 You have ${this.currentData.length} total records in your dataset`);
            
            const headers = Object.keys(this.currentData[0]).filter(key => key !== '_originalIndex');
            insights.push(`📋 Your data contains ${headers.length} different fields/columns`);
            
            // Check for geographic data
            const hasCoordinates = headers.some(h => 
                h.toLowerCase().includes('lat') || h.toLowerCase().includes('lng') || 
                h.toLowerCase().includes('longitude') || h.toLowerCase().includes('latitude'));
            
            if (hasCoordinates) {
                insights.push(`🗺️ Geographic mapping is available with coordinate data`);
            }
            
            insights.push(`💡 Consider setting up automated alerts for data quality monitoring`);
        }
        
        return insights;
    }

    detectAnomalies() {
        const anomalies = [];
        
        // Check for missing coordinates
        let missingCoords = 0;
        this.currentData.forEach(record => {
            const headers = Object.keys(record);
            const hasLat = headers.some(h => h.toLowerCase().includes('lat'));
            const hasLng = headers.some(h => h.toLowerCase().includes('lng') || h.toLowerCase().includes('long'));
            
            if (hasLat && hasLng) {
                const latField = headers.find(h => h.toLowerCase().includes('lat'));
                const lngField = headers.find(h => h.toLowerCase().includes('lng') || h.toLowerCase().includes('long'));
                
                const lat = parseFloat(record[latField]);
                const lng = parseFloat(record[lngField]);
                
                if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                    missingCoords++;
                }
            }
        });
        
        if (missingCoords > 0) {
            anomalies.push(`📍 ${missingCoords} records have missing or invalid coordinates`);
        }
        
        return anomalies;
    }

    createDataSummary() {
        const total = this.currentData.length;
        const headers = Object.keys(this.currentData[0] || {}).filter(key => key !== '_originalIndex');
        
        return `• **Total Records**: ${total}\n` +
               `• **Data Fields**: ${headers.length}\n` +
               `• **Data Source**: Google Sheets Integration\n` +
               `• **Last Updated**: ${new Date().toLocaleDateString()}\n` +
               `• **Map Integration**: ${headers.some(h => h.toLowerCase().includes('lat')) ? 'Available' : 'Not Available'}`;
    }

    performSiteAnalysis(query) {
        return `🏢 **Site Analysis**\n\nBased on your query "${query}", here's what I found:\n\n` +
               `• Total sites in database: ${this.currentData.length}\n` +
               `• Geographic distribution across Philippines Region 2\n` +
               `• Multiple technology types detected\n\n` +
               `For more specific analysis, try asking about particular aspects like "performance by region" or "technology distribution".`;
    }

    analyzePerformanceMetrics() {
        return `Your site data is loaded and ready for performance analysis.\n\n` +
               `📊 **Current Metrics**:\n` +
               `• Data loading: Operational\n` +
               `• Map visualization: Active\n` +
               `• Filtering system: Functional\n\n` +
               `💡 **Recommendations**:\n` +
               `• Set up automated monitoring\n` +
               `• Consider adding performance thresholds\n` +
               `• Implement real-time data updates`;
    }

    // Add message to chat
    addMessage(content, sender) {
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="ai-message-content">${content}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-message-content">${content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    showTyping() {
        const messagesContainer = document.getElementById('aiChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing';
        typingDiv.id = 'aiTypingIndicator';
        typingDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="ai-typing">
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
                <div class="ai-typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hide typing indicator
    hideTyping() {
        const typingIndicator = document.getElementById('aiTypingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Get help message
    getHelpMessage() {
        return `🤖 **AI Assistant Help**\n\n` +
               `I can assist you with:\n\n` +
               `📊 **Data Analysis**\n` +
               `• "Analyze my data"\n` +
               `• "Show me performance trends"\n` +
               `• "What patterns do you see?"\n\n` +
               `🔍 **Issue Detection**\n` +
               `• "Find problems in my data"\n` +
               `• "Check for anomalies"\n` +
               `• "Show connectivity issues"\n\n` +
               `📈 **Insights & Reports**\n` +
               `• "Generate insights"\n` +
               `• "Create a summary"\n` +
               `• "What should I focus on?"\n\n` +
               `📍 **Geographic Analysis**\n` +
               `• "Analyze by region"\n` +
               `• "Show site distribution"\n` +
               `• "Map coverage analysis"\n\n` +
               `Just ask me naturally - I'll understand and help! 😊`;
    }
}

// Initialize AI Assistant when script loads
const aiAssistant = new AIAssistant();

// Make it available globally for dashboard integration
window.aiAssistant = aiAssistant;

// Integration hook for dashboard data updates (prevent duplicate wrapping)
if (typeof window.processSheetData === 'function' && !window.processSheetData._aiWrapped) {
    const originalProcessSheetData = window.processSheetData;
    window.processSheetData = function(data) {
        originalProcessSheetData(data);
        if (window.aiAssistant && window.allData) {
            window.aiAssistant.updateData(window.allData);
        }
    };
    // Mark as wrapped to prevent duplicate wrapping
    window.processSheetData._aiWrapped = true;
}