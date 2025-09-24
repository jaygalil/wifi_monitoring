resizable, draggable chat interface
// Provides a better chat experience with flexible sizing and positioning

class EnhancedChatPanel {
    constructor() {
        this.isVisible = false;
        this.panelWidth = 400; // Default width
        this.minWidth = 280;
        this.maxWidth = 900;
        this.isResizing = false;
        this.isDragging = false;
        // Docking and auto-hide options
        this.dockSide = 'left'; // default mount to left side
        this.autoHideEnabled = false;
        this.autoHideDelay = 15000; // ms
        this.autoHideTimer = null;
        
        this.init();
    }

    init() {
        this.createEnhancedChatPanel();
        this.setupEventListeners();
        console.log('🚀 Enhanced Chat Panel initialized');
    }

    createEnhancedChatPanel() {
        // Remove existing panels if any
        const existingPanel = document.getElementById('enhancedChatPanel');
        if (existingPanel) existingPanel.remove();

        const chatPanelHTML = `
            <!-- Enhanced Side Chat Panel -->
            <div id="enhancedChatPanel" class="enhanced-chat-panel">
                <!-- Chat Header with Controls -->
                <div class="chat-header">
                    <div class="chat-title">
                        <i class="fas fa-robot me-2"></i>
                        <span>AI Assistant</span>
                        <span class="chat-status" id="chatConnectionStatus">●</span>
                    </div>
                    <div class="chat-controls">
                        <button class="chat-control-btn" onclick="enhancedChat.minimizeChat()" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="chat-control-btn" onclick="enhancedChat.toggleChat()" title="Hide">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="chat-control-btn" onclick="enhancedChat.toggleDockSide()" title="Dock Left/Right">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="chat-control-btn" onclick="enhancedChat.toggleAutoHide()" title="Auto Hide">
                            <i class="fas fa-eye-slash"></i>
                        </button>
                    </div>
                </div>

                <!-- Resize Handle -->
                <div class="chat-resize-handle" id="chatResizeHandle">
                    <div class="resize-indicator">
                        <i class="fas fa-grip-lines-vertical"></i>
                    </div>
                </div>

                <!-- Quick Actions Bar -->
                <div class="chat-quick-actions">
                    <button class="quick-action-btn" onclick="enhancedChat.quickAction('analyze')" title="Analyze Data">
                        <i class="fas fa-chart-line"></i>
                    </button>
                    <button class="quick-action-btn" onclick="enhancedChat.quickAction('insights')" title="Get Insights">
                        <i class="fas fa-lightbulb"></i>
                    </button>
                    <button class="quick-action-btn" onclick="enhancedChat.quickAction('issues')" title="Find Issues">
                        <i class="fas fa-exclamation-triangle"></i>
                    </button>
                    <button class="quick-action-btn" onclick="enhancedChat.quickAction('optimize')" title="Optimize">
                        <i class="fas fa-magic"></i>
                    </button>
                    <button class="quick-action-btn" onclick="enhancedChat.clearChat()" title="Clear Chat">
                        <i class="fas fa-broom"></i>
                    </button>
                </div>

                <!-- Chat Messages Area -->
                <div class="chat-messages-container" id="chatMessagesContainer">
                    <div class="welcome-message">
                        <div class="ai-avatar-large">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="welcome-content">
                            <h6>👋 Welcome to AI Assistant!</h6>
                            <p>I'm here to help you analyze your Philippines Region 2 site data.</p>
                            <div class="welcome-features">
                                <span class="feature-tag">📊 Data Analysis</span>
                                <span class="feature-tag">🗺️ Geographic Insights</span>
                                <span class="feature-tag">🔍 Issue Detection</span>
                                <span class="feature-tag">⚡ Optimization</span>
                            </div>
                            <p class="welcome-tip">
                                <strong>💡 Try asking:</strong> 
                                <em>"Analyze my connectivity data"</em> or 
                                <em>"Find sites with issues"</em>
                            </p>
                        </div>
                    </div>
                    
                    <div id="chatMessagesList" class="chat-messages-list">
                        <!-- Messages will be added here -->
                    </div>
                </div>

                <!-- Chat Input Area -->
                <div class="chat-input-area">
                    <div class="chat-suggestions" id="chatSuggestions">
                        <button class="suggestion-pill" onclick="enhancedChat.useSuggestion(this)">
                            "What patterns do you see in my data?"
                        </button>
                        <button class="suggestion-pill" onclick="enhancedChat.useSuggestion(this)">
                            "Show me connectivity issues"
                        </button>
                        <button class="suggestion-pill" onclick="enhancedChat.useSuggestion(this)">
                            "Analyze coverage gaps"
                        </button>
                    </div>
                    
                    <div class="chat-input-wrapper">
                        <textarea 
                            id="chatInputField" 
                            class="chat-input-field" 
                            placeholder="Ask me anything about your site data..."
                            rows="1"
                            onkeydown="enhancedChat.handleKeyDown(event)"
                            oninput="enhancedChat.autoResizeTextarea(this)"
                        ></textarea>
                        <div class="chat-input-actions">
                            <button class="chat-send-btn" onclick="enhancedChat.sendMessage()" id="chatSendButton">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chat-footer">
                        <small class="chat-info">
                            <span id="chatTypingIndicator" style="display: none;">
                                <i class="fas fa-circle" style="animation: pulse 1.5s infinite;"></i>
                                AI is thinking...
                            </span>
                            <span class="model-info" id="chatModelInfo">
                                Using: <span id="activeModelName">Local AI</span>
                            </span>
                        </small>
                    </div>
                </div>
            </div>

            <!-- Chat Panel Styles -->
            <style>
                .enhanced-chat-panel {
                    position: fixed;
                    top: 0;
                    width: 400px;
                    height: 100vh;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-left: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
                    z-index: 1001;
                    display: flex;
                    flex-direction: column;
                    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                }

                .enhanced-chat-panel.dock-right {
                    right: -400px; /* Hidden by default on right */
                    left: auto;
                }

                .enhanced-chat-panel.dock-right.visible {
                    right: 0;
                }

                .enhanced-chat-panel.dock-left {
                    left: -400px; /* Hidden by default on left */
                    right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible {
                    left: 0;
                }
                right: auto;
                    border-left: none;
                    border-right: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: 5px 0 25px rgba(0, 0, 0, 0.1);
                }

                .enhanced-chat-panel.dock-left.visible