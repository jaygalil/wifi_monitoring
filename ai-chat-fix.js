// AI Chat Visibility Fix
// Ensures the chat button is always visible and working

(function() {
    console.log('🔧 Loading AI Chat visibility fixes...');

    // Function to ensure chat button is visible
    function ensureChatButtonVisible() {
        // Check if AI assistant button exists
        let chatButton = document.getElementById('aiAssistantToggle');
        
        if (!chatButton) {
            console.log('⚠️ AI chat button not found, creating fallback...');
            createFallbackChatButton();
        } else {
            console.log('✅ AI chat button found!');
            enhanceChatButton(chatButton);
        }
    }

    // Create fallback chat button if main one isn't loading
    function createFallbackChatButton() {
        const fallbackButton = document.createElement('div');
        fallbackButton.id = 'fallbackAiChat';
        fallbackButton.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 100px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10000;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                animation: pulse 2s infinite;
            " onclick="toggleFallbackChat()" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                <i class="fas fa-robot" style="color: white; font-size: 20px;"></i>
            </div>
            
            <div id="fallbackChatPanel" style="
                position: fixed;
                top: 70px;
                right: 30px;
                width: 400px;
                max-width: calc(100vw - 60px);
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                display: none;
                flex-direction: column;
                max-height: 500px;
            ">
                <div style="
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div style="font-weight: 600; display: flex; align-items: center;">
                        <i class="fas fa-robot" style="margin-right: 10px;"></i>
                        AI Chat Assistant
                    </div>
                    <button onclick="toggleFallbackChat()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 5px;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 20px;">
                    <div style="
                        background: #f8f9ff;
                        padding: 15px;
                        border-radius: 10px;
                        margin-bottom: 15px;
                        border-left: 4px solid #667eea;
                    ">
                        <strong>🤖 AI Assistant Ready!</strong><br>
                        <small>Ask me about your site data, connectivity patterns, or analysis needs.</small>
                    </div>
                    
                    <div id="chatMessages" style="
                        max-height: 200px;
                        overflow-y: auto;
                        margin-bottom: 15px;
                        padding: 10px;
                        background: #f8f9ff;
                        border-radius: 8px;
                        min-height: 100px;
                    ">
                        <div style="
                            background: white;
                            padding: 10px;
                            border-radius: 8px;
                            margin-bottom: 10px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        ">
                            <strong>AI:</strong> Hi! I'm ready to help analyze your site data. Try asking: "What insights do you see in my data?"
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="chatInput" placeholder="Ask about your site data..." style="
                            flex: 1;
                            padding: 12px;
                            border: 2px solid #e5e7eb;
                            border-radius: 25px;
                            outline: none;
                            font-size: 14px;
                        " onkeypress="if(event.key==='Enter') sendFallbackMessage()">
                        <button onclick="sendFallbackMessage()" style="
                            background: #667eea;
                            color: white;
                            border: none;
                            border-radius: 50%;
                            width: 45px;
                            height: 45px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    
                    <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;">
                        <button onclick="sendQuickMessage('Analyze my data')" style="
                            background: #e5e7eb;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 15px;
                            font-size: 12px;
                            cursor: pointer;
                        ">📊 Analyze Data</button>
                        <button onclick="sendQuickMessage('Show connectivity issues')" style="
                            background: #e5e7eb;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 15px;
                            font-size: 12px;
                            cursor: pointer;
                        ">🔍 Find Issues</button>
                        <button onclick="sendQuickMessage('Generate insights')" style="
                            background: #e5e7eb;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 15px;
                            font-size: 12px;
                            cursor: pointer;
                        ">💡 Insights</button>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes pulse {
                    0% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
                    50% { box-shadow: 0 8px 35px rgba(102, 126, 234, 0.6); }
                    100% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
                }
            </style>
        `;

        document.body.appendChild(fallbackButton);
        console.log('✅ Fallback chat button created');
    }

    // Toggle fallback chat
    window.toggleFallbackChat = function() {
        const panel = document.getElementById('fallbackChatPanel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        }
    };

    // Send fallback message
    window.sendFallbackMessage = function() {
        const input = document.getElementById('chatInput');
        if (!input.value.trim()) return;
        
        const message = input.value.trim();
        input.value = '';
        
        addChatMessage('You', message, true);
        
        // Process with AI system
        processFallbackMessage(message);
    };

    // Send quick message
    window.sendQuickMessage = function(message) {
        document.getElementById('chatInput').value = message;
        sendFallbackMessage();
    };

    // Add message to chat
    function addChatMessage(sender, message, isUser = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            background: ${isUser ? '#667eea' : 'white'};
            color: ${isUser ? 'white' : 'black'};
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Process message with AI
    async function processFallbackMessage(message) {
        addChatMessage('AI', '🤔 Analyzing your question...', false);
        
        try {
            // Try to use the main AI system
            if (window.aiAssistant && window.aiAssistant.processMessage) {
                const response = await window.aiAssistant.processMessage(message);
                updateLastChatMessage(response);
            } else if (window.advancedAI) {
                // Use advanced AI directly
                const response = await window.advancedAI.processNaturalLanguageQuery(message, window.allData || []);
                if (response.enhanced) {
                    updateLastChatMessage(response.response);
                } else {
                    updateLastChatMessage(response);
                }
            } else {
                // Fallback to simple responses
                const response = generateSimpleResponse(message);
                updateLastChatMessage(response);
            }
        } catch (error) {
            console.error('Chat error:', error);
            updateLastChatMessage('Sorry, I encountered an error. Please try again or check the browser console for details.');
        }
    }

    // Update the last AI message
    function updateLastChatMessage(newMessage) {
        const messagesContainer = document.getElementById('chatMessages');
        const messages = messagesContainer.children;
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            lastMessage.innerHTML = `<strong>AI:</strong> ${newMessage.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}`;
        }
    }

    // Generate simple responses
    function generateSimpleResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
            return "📊 I can help analyze your site data! Load your data from Google Sheets first, then I can provide insights about connectivity patterns, performance metrics, and geographic distribution.";
        } else if (lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
            return "🔍 To identify issues, I'll need to examine your loaded data. Common issues I can detect include: missing coordinates, connectivity gaps, and performance anomalies.";
        } else if (lowerMessage.includes('insight')) {
            return "💡 I can generate insights about your network infrastructure including geographic coverage, technology distribution, and performance trends. Make sure your data is loaded first!";
        } else {
            return `🤖 I understand you're asking about: "${message}". I can help with data analysis, finding issues, generating insights, and site optimization. What specific aspect of your network data would you like me to focus on?`;
        }
    }

    // Enhance existing chat button if found
    function enhanceChatButton(button) {
        // Add a more visible indicator
        button.style.animation = 'pulse 3s infinite';
        button.title = '🤖 Click to chat with AI Assistant - Analyze your site data!';
        
        // Add glowing effect
        button.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
        
        console.log('✅ Enhanced existing chat button');
    }

    // Check for chat button periodically
    function checkChatButton() {
        setTimeout(() => {
            ensureChatButtonVisible();
        }, 2000);

        setTimeout(() => {
            ensureChatButtonVisible();
        }, 5000);
    }

    // Show notification about chat
    function showChatNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            max-width: 300px;
            animation: slideIn 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <i class="fas fa-robot" style="margin-right: 8px; font-size: 16px;"></i>
                <strong>AI Chat Ready!</strong>
            </div>
            <div style="font-size: 13px;">
                Look for the 🤖 robot button in the bottom-right corner to start chatting with your AI assistant!
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            checkChatButton();
            setTimeout(showChatNotification, 3000);
        });
    } else {
        checkChatButton();
        setTimeout(showChatNotification, 1000);
    }

    console.log('🤖 AI Chat visibility system loaded');

})();