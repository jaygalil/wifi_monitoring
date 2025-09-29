// Enhanced Chat Panel - Flexible, resizable, dockable (left/right), with optional auto-hide
// Creates a side-mounted chatbox that users can resize by dragging the border

class EnhancedChatPanel {
  constructor() {
    // UI state
    this.isVisible = true; // mounted and visible by default
    this.panelWidth = 400; // default width
    this.minWidth = 280;
    this.maxWidth = 900;
    this.isResizing = false;
    this.isDragging = false;

    // Docking and auto-hide
    this.dockSide = 'right'; // default mount to RIGHT side
    this.autoHideEnabled = false;
    this.autoHideDelay = 15000; // ms
    this.autoHideTimer = null;

    // Elements
    this.panelEl = null;
    this.resizeHandleEl = null;
    this.inputEl = null;
    this.autoHideBtn = null;

    // Initialize
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.createPanel();
    this.attachStyles();
    this.attachEvents();
    this.applyDockClass();
    this.updatePanelWidth(this.panelWidth);
    if (this.isVisible) this.showChat(); else this.hideChat();
    
    // Listen for data loaded events
    window.addEventListener('siteTrackerDataLoaded', (event) => {
      console.log('🗨️ Enhanced Chat Panel received data loaded event:', event.detail.count, 'records');
      this.onDataLoaded(event.detail);
    });
    
    console.log('✅ EnhancedChatPanel initialized');
  }

  createPanel() {
    // Remove old panel if exists
    const existing = document.getElementById('enhancedChatPanel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'enhancedChatPanel';
    panel.className = 'enhanced-chat-panel dock-right visible'; // Start with dock-right

    panel.innerHTML = `
      <div class="chat-header">
        <div class="chat-title">
          <i class="fas fa-robot me-2"></i>
          <span>AI Assistant</span>
          <span class="chat-status" id="chatConnectionStatus">●</span>
        </div>
        <div class="chat-controls">
          <button class="chat-control-btn" id="btnMinimize" title="Minimize"><i class="fas fa-minus"></i></button>
          <button class="chat-control-btn" id="btnHide" title="Hide"><i class="fas fa-times"></i></button>
          <button class="chat-control-btn" id="btnDock" title="Dock Left/Right"><i class="fas fa-exchange-alt"></i></button>
          <button class="chat-control-btn" id="btnAutoHide" title="Auto Hide"><i class="fas fa-eye-slash"></i></button>
        </div>
      </div>

      <div class="chat-resize-handle" id="chatResizeHandle">
        <div class="resize-indicator"><i class="fas fa-grip-lines-vertical"></i></div>
      </div>

      <div class="chat-quick-actions">
        <button class="quick-action-btn" data-action="analyze" title="Analyze Data"><i class="fas fa-chart-line"></i></button>
        <button class="quick-action-btn" data-action="insights" title="Get Insights"><i class="fas fa-lightbulb"></i></button>
        <button class="quick-action-btn" data-action="report" title="Generate Report"><i class="fas fa-file-alt"></i></button>
        <button class="quick-action-btn" data-action="pdf" title="Export PDF"><i class="fas fa-file-pdf"></i></button>
        <button class="quick-action-btn" data-action="issues" title="Find Issues"><i class="fas fa-exclamation-triangle"></i></button>
        <button class="quick-action-btn" data-action="optimize" title="Optimize"><i class="fas fa-magic"></i></button>
        <button class="quick-action-btn" id="btnClearChat" title="Clear Chat"><i class="fas fa-broom"></i></button>
      </div>

      <div class="chat-messages-container" id="chatMessagesContainer">
        <div class="welcome-message">
          <div class="ai-avatar-large"><i class="fas fa-robot"></i></div>
          <div class="welcome-content">
            <h6>👋 Welcome to AI Assistant!</h6>
            <p>I can help analyze your Site Tracker data.</p>
            <div class="welcome-features">
              <span class="feature-tag">📊 Data Analysis</span>
              <span class="feature-tag">📋 Generate Reports</span>
              <span class="feature-tag">📄 Export PDFs</span>
              <span class="feature-tag">🗺️ Geographic Insights</span>
              <span class="feature-tag">🔍 Issue Detection</span>
              <span class="feature-tag">⚡ Optimization</span>
            </div>
            <p class="welcome-tip"><strong>💡 Try:</strong> "Generate a site status report" or "Export performance report as PDF"</p>
          </div>
        </div>
        <div id="chatMessagesList" class="chat-messages-list"></div>
      </div>

      <div class="chat-input-area">
        <div class="chat-suggestions" id="chatSuggestions">
          <button class="suggestion-pill">"Generate a site status report"</button>
          <button class="suggestion-pill">"Create connectivity analysis report"</button>
          <button class="suggestion-pill">"Export performance report as PDF"</button>
          <button class="suggestion-pill">"Show me connectivity issues"</button>
        </div>
        <div class="chat-input-wrapper">
          <textarea id="chatInputField" class="chat-input-field" rows="1" placeholder="Ask me anything..."></textarea>
          <div class="chat-input-actions">
            <button class="chat-send-btn" id="chatSendButton"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
        <div class="chat-footer">
          <small class="chat-info">
            <span id="chatTypingIndicator" style="display:none;"><i class="fas fa-circle" style="animation:pulse 1.5s infinite;"></i> AI is thinking...</span>
            <span class="model-info" id="chatModelInfo">Using: <span id="activeModelName">Local AI</span></span>
          </small>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Cache elements
    this.panelEl = panel;
    this.resizeHandleEl = panel.querySelector('#chatResizeHandle');
    this.inputEl = panel.querySelector('#chatInputField');
    this.autoHideBtn = panel.querySelector('#btnAutoHide');
  }

  attachStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .enhanced-chat-panel { 
        position:fixed; 
        top:0; 
        width:${this.panelWidth}px; 
        height:100vh; 
        background:rgba(255,255,255,0.98); 
        backdrop-filter:blur(20px); 
        -webkit-backdrop-filter:blur(20px); 
        z-index:10050; 
        display:flex; 
        flex-direction:column; 
        transition:left .3s cubic-bezier(.4,0,.2,1), right .3s cubic-bezier(.4,0,.2,1); 
        font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif; 
        margin-top:0; 
      }
      .enhanced-chat-panel.dock-right { 
        right:-${this.panelWidth}px; 
        left:auto; 
        box-shadow:-5px 0 25px rgba(0,0,0,.1); 
        border-left:1px solid rgba(0,0,0,.1); 
      }
      .enhanced-chat-panel.dock-right.visible { 
        right:0; 
      }
      .enhanced-chat-panel.dock-left { 
        left:-${this.panelWidth}px; 
        right:auto; 
        box-shadow:5px 0 25px rgba(0,0,0,.1); 
        border-right:1px solid rgba(0,0,0,.1); 
      }
      .enhanced-chat-panel.dock-left.visible { 
        left:0; 
      }
      .chat-header { 
        background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); 
        color:#fff; 
        padding:15px 20px; 
        display:flex; 
        justify-content:space-between; 
        align-items:center; 
        user-select:none; 
        flex-shrink:0; 
        cursor:move; 
      }
      .chat-title { 
        font-weight:600; 
        font-size:16px; 
        display:flex; 
        align-items:center; 
      }
      .chat-status { 
        margin-left:10px; 
        color:#4ade80; 
        font-size:12px; 
        animation:pulse 2s infinite; 
      }
      .chat-controls { 
        display:flex; 
        gap:8px; 
      }
      .chat-control-btn { 
        background:rgba(255,255,255,.2); 
        border:none; 
        color:#fff; 
        width:32px; 
        height:32px; 
        border-radius:6px; 
        cursor:pointer; 
        display:flex; 
        align-items:center; 
        justify-content:center; 
        transition:.2s; 
        font-size:14px; 
        flex-shrink:0; 
      }
      .chat-control-btn:hover { 
        background:rgba(255,255,255,.3); 
        transform:scale(1.05); 
      }
      .chat-resize-handle { 
        position:absolute; 
        top:0; 
        width:8px; 
        height:100%; 
        cursor:ew-resize; 
        background:transparent; 
        z-index:10060; 
        display:flex; 
        align-items:center; 
        justify-content:center; 
        transition:.2s; 
      }
      .chat-resize-handle:hover { 
        background:rgba(102,126,234,.08); 
      }
      .enhanced-chat-panel.dock-right .chat-resize-handle { 
        left:0; 
        right:auto; 
      }
      .enhanced-chat-panel.dock-left .chat-resize-handle { 
        right:0; 
        left:auto; 
      }
      .resize-indicator { 
        color:rgba(102,126,234,.5); 
        font-size:12px; 
      }
      .chat-quick-actions { 
        padding:12px 20px; 
        background:rgba(102,126,234,.05); 
        border-bottom:1px solid rgba(0,0,0,.05); 
        display:flex; 
        gap:8px; 
        flex-wrap:wrap; 
        flex-shrink:0; 
      }
      .quick-action-btn { 
        background:#fff; 
        border:1px solid rgba(102,126,234,.2); 
        color:#667eea; 
        padding:8px 12px; 
        border-radius:20px; 
        font-size:12px; 
        cursor:pointer; 
        transition:.2s; 
        display:flex; 
        align-items:center; 
        gap:6px; 
        flex-shrink:0; 
      }
      .quick-action-btn:hover { 
        background:#667eea; 
        color:#fff; 
        transform:translateY(-1px); 
        box-shadow:0 4px 8px rgba(102,126,234,.2); 
      }
      .chat-messages-container { 
        flex:1; 
        overflow-y:auto; 
        padding:20px; 
        min-height:0; 
      }
      .welcome-message { 
        text-align:center; 
        margin-bottom:20px; 
        padding:20px; 
        background:linear-gradient(135deg,rgba(102,126,234,.05) 0%, rgba(118,75,162,.05) 100%); 
        border-radius:16px; 
        border:1px solid rgba(102,126,234,.1); 
      }
      .ai-avatar-large { 
        width:60px; 
        height:60px; 
        background:linear-gradient(135deg,#667eea 0%, #764ba2 100%); 
        border-radius:50%; 
        display:flex; 
        align-items:center; 
        justify-content:center; 
        color:#fff; 
        font-size:24px; 
        margin:0 auto 15px; 
        box-shadow:0 8px 20px rgba(102,126,234,.3); 
      }
      .welcome-content h6 { 
        margin-bottom:10px; 
        color:#333; 
        font-weight:600; 
      }
      .welcome-content p { 
        color:#666; 
        margin-bottom:15px; 
      }
      .welcome-features { 
        display:flex; 
        flex-wrap:wrap; 
        gap:6px; 
        justify-content:center; 
        margin-bottom:15px; 
      }
      .feature-tag { 
        background:#fff; 
        padding:4px 8px; 
        border-radius:12px; 
        font-size:11px; 
        border:1px solid rgba(102,126,234,.2); 
        color:#667eea; 
      }
      .chat-message { 
        margin-bottom:16px; 
      }
      .message-user { 
        text-align:right; 
      }
      .message-ai { 
        text-align:left; 
      }
      .message-bubble { 
        display:inline-block; 
        padding:12px 16px; 
        border-radius:16px; 
        max-width:85%; 
        word-wrap:break-word; 
      }
      .message-user .message-bubble { 
        background:#667eea; 
        color:#fff; 
        border-bottom-right-radius:4px; 
      }
      .message-ai .message-bubble { 
        background:#f8f9ff; 
        color:#333; 
        border:1px solid rgba(102,126,234,.1); 
        border-bottom-left-radius:4px; 
      }
      .chat-input-area { 
        padding:20px; 
        background:#fff; 
        border-top:1px solid rgba(0,0,0,.05); 
        flex-shrink:0; 
      }
      .chat-suggestions { 
        display:flex; 
        gap:6px; 
        margin-bottom:12px; 
        flex-wrap:wrap; 
      }
      .suggestion-pill { 
        background:rgba(102,126,234,.08); 
        border:1px solid rgba(102,126,234,.2); 
        color:#667eea; 
        padding:6px 12px; 
        border-radius:16px; 
        font-size:11px; 
        cursor:pointer; 
        transition:.2s; 
        flex-shrink:0; 
      }
      .suggestion-pill:hover { 
        background:rgba(102,126,234,.15); 
        transform:translateY(-1px); 
      }
      .chat-input-wrapper { 
        display:flex; 
        gap:12px; 
        align-items:flex-end; 
        background:#f8f9ff; 
        border:2px solid #e5e7eb; 
        border-radius:20px; 
        padding:12px 16px; 
        transition:.2s; 
      }
      .chat-input-wrapper:focus-within { 
        border-color:#667eea; 
        box-shadow:0 0 0 3px rgba(102,126,234,.1); 
      }
      .chat-input-field { 
        flex:1; 
        border:none; 
        outline:none; 
        background:transparent; 
        font-size:14px; 
        line-height:1.4; 
        resize:none; 
        max-height:120px; 
        overflow-y:auto; 
      }
      .chat-send-btn { 
        background:#667eea; 
        border:none; 
        color:#fff; 
        width:36px; 
        height:36px; 
        border-radius:50%; 
        cursor:pointer; 
        display:flex; 
        align-items:center; 
        justify-content:center; 
        transition:.2s; 
        flex-shrink:0; 
      }
      .chat-send-btn:hover { 
        background:#5a6fd8; 
        transform:scale(1.05); 
      }
      @media (max-width: 768px) { 
        .enhanced-chat-panel { 
          width:100vw; 
          top:0; 
          height:100vh; 
          z-index:10060; 
        } 
        .enhanced-chat-panel.dock-right { 
          right:-100vw; 
        } 
        .enhanced-chat-panel.dock-right.visible { 
          right:0; 
        } 
        .enhanced-chat-panel.dock-left { 
          left:-100vw; 
        } 
        .enhanced-chat-panel.dock-left.visible { 
          left:0; 
        } 
        .chat-resize-handle { 
          display:none; 
        } 
        .chat-header { 
          padding:12px 16px; 
        }
        .chat-quick-actions { 
          padding:10px 16px; 
        }
        .chat-messages-container { 
          padding:16px; 
        }
        .chat-input-area { 
          padding:16px; 
        }
      }
      @media (max-width: 480px) {
        .enhanced-chat-panel {
          width:100vw;
        }
        .enhanced-chat-panel.dock-right {
          right:-100vw;
        }
        .enhanced-chat-panel.dock-left {
          left:-100vw;
        }
        .chat-controls {
          gap:6px;
        }
        .chat-control-btn {
          width:28px;
          height:28px;
          font-size:12px;
        }
        .quick-action-btn {
          padding:6px 10px;
          font-size:11px;
        }
        .chat-input-wrapper {
          padding:10px 12px;
        }
        .chat-send-btn {
          width:32px;
          height:32px;
        }
      }
      /* Ensure proper flex layout */
      body {
        overflow-x: hidden;
      }
      .dashboard-container {
        position: relative;
      }
      /* Prevent content overlap */
      .main-content {
        transition: margin-right 0.3s ease, margin-left 0.3s ease;
      }
      .main-content.chat-panel-right {
        margin-right: ${this.panelWidth}px;
      }
      .main-content.chat-panel-left {
        margin-left: ${this.panelWidth}px;
      }
      /* Auto-hide indicator */
      .chat-control-btn.active {
        background: rgba(74, 222, 128, 0.3) !important;
        color: #4ade80 !important;
      }
      
      // Main content margin adjustments for chat panel
      .main-content.chat-panel-right {
        margin-right: 320px;
        transition: margin-right 0.3s ease;
      }
      
      .main-content.chat-panel-left {
        margin-left: 320px;
        transition: margin-left 0.3s ease;
      }
      
      @media (max-width: 768px) {
        .main-content.chat-panel-right,
        .main-content.chat-panel-left {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  attachEvents() {
    // Controls
    this.panelEl.querySelector('#btnMinimize').addEventListener('click', () => this.minimizeChat());
    this.panelEl.querySelector('#btnHide').addEventListener('click', () => this.toggleChat());
    this.panelEl.querySelector('#btnDock').addEventListener('click', () => this.toggleDockSide());
    this.autoHideBtn.addEventListener('click', () => this.toggleAutoHide());

    // Drag functionality for header
    const header = this.panelEl.querySelector('.chat-header');
    header.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
      this.startDrag(e);
    });
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) this.handleDrag(e);
      if (this.isResizing) this.handleResize(e);
    });
    document.addEventListener('mouseup', () => {
      if (this.isResizing) {
        this.isResizing = false;
        document.body.style.cursor = '';
      }
      if (this.isDragging) {
        this.isDragging = false;
        document.body.style.cursor = '';
      }
    });

    // Resize
    this.resizeHandleEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.isResizing = true;
      document.body.style.cursor = 'ew-resize';
    });

    // Suggestions
    this.panelEl.querySelectorAll('.suggestion-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.inputEl.value = btn.textContent.replace(/^"|"$/g, '');
        this.focusInput();
        this.resetAutoHideTimer();
      });
    });

    // Send
    this.panelEl.querySelector('#chatSendButton').addEventListener('click', () => this.sendMessage());
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
      this.resetAutoHideTimer();
    });

    // Activity resets auto-hide
    ['mousemove', 'click', 'keydown', 'scroll'].forEach(evt => {
      this.panelEl.addEventListener(evt, () => this.resetAutoHideTimer());
    });
  }

  handleResize(e) {
    const rect = this.panelEl.getBoundingClientRect();
    let newWidth;
    if (this.dockSide === 'left') {
      // Dragging from right edge
      const deltaX = e.clientX - rect.right; // positive when moving outward
      newWidth = rect.width + deltaX;
    } else {
      // dock right, dragging from left edge
      const deltaX = rect.left - e.clientX; // positive when moving outward
      newWidth = rect.width + deltaX;
    }
    newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newWidth));
    this.updatePanelWidth(newWidth);
  }

  startDrag(e) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.dragStartLeft = parseInt(this.panelEl.style.left) || 0;
    this.dragStartTop = parseInt(this.panelEl.style.top) || 0;
    this.panelEl.style.transition = 'none';
    document.body.style.cursor = 'move';
    e.preventDefault();
  }

  handleDrag(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;
    
    let newLeft = this.dragStartLeft + deltaX;
    let newTop = this.dragStartTop + deltaY;
    
    // Keep panel within viewport bounds
    const maxX = window.innerWidth - this.panelEl.offsetWidth;
    const maxY = window.innerHeight - this.panelEl.offsetHeight;
    
    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));
    
    this.panelEl.style.left = newLeft + 'px';
    this.panelEl.style.top = newTop + 'px';
    this.panelEl.style.right = 'auto';
    this.panelEl.style.bottom = 'auto';
    
    // Remove dock classes when dragging
    this.panelEl.classList.remove('dock-left', 'dock-right');
  }

  updatePanelWidth(w) {
    this.panelWidth = Math.round(w);
    this.panelEl.style.width = `${this.panelWidth}px`;
    // Update off-screen positions for hide state
    if (!this.isVisible) {
      const off = `-${this.panelWidth}px`;
      if (this.dockSide === 'right') { this.panelEl.style.right = off; this.panelEl.style.left = 'auto'; }
      else { this.panelEl.style.left = off; this.panelEl.style.right = 'auto'; }
    }
  }

  applyDockClass() {
    this.panelEl.classList.remove('dock-left', 'dock-right');
    this.panelEl.classList.add(this.dockSide === 'right' ? 'dock-right' : 'dock-left');
  }

  toggleDockSide() {
    this.dockSide = this.dockSide === 'left' ? 'right' : 'left';
    this.applyDockClass();
    // Adjust resize handle side is handled by CSS via class
    // Ensure correct positioning when hidden
    const off = `-${this.panelWidth}px`;
    if (!this.isVisible) {
      if (this.dockSide === 'right') { this.panelEl.style.right = off; this.panelEl.style.left = 'auto'; }
      else { this.panelEl.style.left = off; this.panelEl.style.right = 'auto'; }
    } else {
      if (this.dockSide === 'right') { this.panelEl.style.right = '0'; this.panelEl.style.left = 'auto'; }
      else { this.panelEl.style.left = '0'; this.panelEl.style.right = 'auto'; }
      
      // Update main content margin
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        if (this.dockSide === 'right') {
          mainContent.classList.add('chat-panel-right');
          mainContent.classList.remove('chat-panel-left');
        } else {
          mainContent.classList.add('chat-panel-left');
          mainContent.classList.remove('chat-panel-right');
        }
      }
    }
  }

  toggleAutoHide() {
    this.autoHideEnabled = !this.autoHideEnabled;
    this.autoHideBtn.classList.toggle('active', this.autoHideEnabled);
    this.autoHideBtn.title = this.autoHideEnabled ? 'Auto Hide: ON' : 'Auto Hide: OFF';
    if (this.autoHideEnabled && this.isVisible) {
      this.startAutoHideTimer();
    } else {
      this.stopAutoHideTimer();
    }
  }

  startAutoHideTimer() {
    this.stopAutoHideTimer();
    this.autoHideTimer = setTimeout(() => this.hideChat(), this.autoHideDelay);
  }

  stopAutoHideTimer() {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = null;
    }
  }

  resetAutoHideTimer() {
    if (this.autoHideEnabled && this.isVisible) {
      this.startAutoHideTimer();
    }
  }

  minimizeChat() {
    // Collapse to a small width but keep visible
    this.updatePanelWidth(this.minWidth);
    this.focusInput();
    this.resetAutoHideTimer();
  }

  toggleChat() {
    if (this.isVisible) this.hideChat(); else this.showChat();
  }

  showChat() {
    this.isVisible = true;
    this.panelEl.classList.add('visible');
    this.panelEl.style.zIndex = '9999'; // Ensure panel is always in front
    if (this.dockSide === 'right') { this.panelEl.style.right = '0'; this.panelEl.style.left = 'auto'; }
    else { this.panelEl.style.left = '0'; this.panelEl.style.right = 'auto'; }
    this.focusInput();
    if (this.autoHideEnabled) this.startAutoHideTimer();
    // Adjust main content margin
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (this.dockSide === 'right') {
        mainContent.classList.add('chat-panel-right');
        mainContent.classList.remove('chat-panel-left');
      } else {
        mainContent.classList.add('chat-panel-left');
        mainContent.classList.remove('chat-panel-right');
      }
    }
  }

  hideChat() {
    this.isVisible = false;
    this.panelEl.classList.remove('visible');
    const off = `-${this.panelWidth}px`;
    if (this.dockSide === 'right') { this.panelEl.style.right = off; this.panelEl.style.left = 'auto'; }
    else { this.panelEl.style.left = off; this.panelEl.style.right = 'auto'; }
    this.stopAutoHideTimer();
    
    // Remove main content margin adjustment
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('chat-panel-right', 'chat-panel-left');
    }
  }

  focusInput() {
    try { this.inputEl && this.inputEl.focus(); } catch (_) {}
  }

  updateConnectionStatus(ok = true) {
    const el = this.panelEl.querySelector('#chatConnectionStatus');
    if (!el) return;
    el.style.color = ok ? '#4ade80' : '#f87171';
    el.title = ok ? 'Connected' : 'Offline';
  }

  async sendMessage() {
    const text = (this.inputEl.value || '').trim();
    if (!text) return;
    this.addMessage(text, 'user');
    this.inputEl.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      let response;
      
      // Use AI Configuration Bridge if available
      if (window.makeAIRequest) {
        console.log('🤖 Using AI Configuration Bridge for request...');
        
        // Get current data from various sources
        const currentData = window.allData || window.filteredData || [];
        console.log('📊 Sending data to AI:', {
          dataLength: currentData.length,
          hasData: currentData.length > 0
        });
        
        response = await window.makeAIRequest(text, currentData);
      } else {
        console.log('⚠️ AI Configuration Bridge not available');
        
        // Check for local data and provide basic analysis
        const currentData = window.allData || window.filteredData || [];
        if (currentData.length > 0) {
          response = `🤖 I can see you have ${currentData.length} sites loaded from your Google Sheets data!\n\n**Your question**: "${text}"\n\n**Basic Analysis Available**:\n• 📊 ${currentData.length} total records loaded\n• 🗺️ Geographic data available for mapping\n• 🔍 Site monitoring data ready for analysis\n\n**For AI-powered insights**: Configure OpenRouter or DeepSeek in the left panel to get detailed analysis about your ${currentData.length} sites including connectivity patterns, geographic insights, and optimization recommendations.`;
        } else {
          response = `🤖 I understand you're asking about: "${text}".\n\n**No data loaded yet** - Please load your Google Sheets data first using the configuration panel on the left.\n\nOnce loaded, I can help with:\n• 📊 Data Analysis of your sites\n• 🗺️ Geographic Insights\n• 🔍 Issue Detection\n• ⚡ Optimization Recommendations\n\n**Note**: Configure your AI provider in the left panel for enhanced AI-powered responses.`;
        }
      }
      
      this.hideTypingIndicator();
      this.addMessage(response, 'ai');
      
    } catch (error) {
      console.error('AI request failed:', error);
      this.hideTypingIndicator();
      this.addMessage(`❌ **AI Request Failed**: ${error.message}\n\nPlease check your AI Configuration settings.`, 'ai');
    }
  }

  addMessage(content, sender = 'ai') {
    const list = this.panelEl.querySelector('#chatMessagesList');
    const item = document.createElement('div');
    item.className = `chat-message message-${sender}`;
    
    // Format content with markdown-like styling
    const formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ');
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    item.innerHTML = `
      <div class="message-bubble">
        ${formattedContent}
        <div class="message-timestamp" style="font-size: 11px; opacity: 0.6; margin-top: 6px;">${timestamp}</div>
      </div>
    `;
    
    list.appendChild(item);
    // Scroll to bottom
    const container = this.panelEl.querySelector('#chatMessagesContainer');
    container.scrollTop = container.scrollHeight;
  }

  escapeHTML(s) {
    return s.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }
  
  showTypingIndicator() {
    const indicator = this.panelEl.querySelector('#chatTypingIndicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }
  
  hideTypingIndicator() {
    const indicator = this.panelEl.querySelector('#chatTypingIndicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  // Quick action handler for report generation
  quickAction(action) {
    const actionMessages = {
      analyze: "Analyze my data comprehensively",
      insights: "What insights can you find in my data?",
      issues: "Find any issues or anomalies in my data",
      optimize: "Suggest optimizations for my site data",
      report: "Generate a comprehensive site status report",
      pdf: "Export the current data as a PDF report"
    };

    const message = actionMessages[action] || '';
    if (message) {
      this.inputEl.value = message;
      this.sendMessage();
    }

    // Handle special actions
    if (action === 'report' && window.aiReportGenerator) {
      // Trigger report generation immediately
      try {
        this.addMessage('🔄 Generating comprehensive site report...', 'ai');
        const report = await window.aiReportGenerator.generateReport('site-status');
        
        // Display report summary in chat
        let reportSummary = `📊 **Site Status Report Generated**\n\n`;
        reportSummary += `**Report ID:** ${report.id}\n`;
        reportSummary += `**Generated:** ${new Date(report.generatedAt).toLocaleString()}\n`;
        reportSummary += `**Records Analyzed:** ${report.dataSnapshot.totalRecords}\n\n`;
        reportSummary += `**Key Insights:**\n${report.insights}\n\n`;
        reportSummary += `**Recommendations:**\n${report.recommendations.map(r => `• ${r}`).join('\n')}\n\n`;
        reportSummary += `✅ Report generated successfully! You can now export it as PDF.`;
        
        this.addMessage(reportSummary, 'ai');
        
        // Store the report for PDF export
        window.lastGeneratedReport = report;
        
      } catch (error) {
        this.addMessage(`❌ Error generating report: ${error.message}`, 'ai');
      }
      return; // Don't send the message to AI
    } else if (action === 'pdf' && window.aiReportGenerator) {
      // Trigger PDF export
      try {
        this.addMessage('📄 Generating PDF report...', 'ai');
        
        let report = window.lastGeneratedReport;
        if (!report) {
          // Generate a quick report first
          report = await window.aiReportGenerator.generateReport('site-status');
          window.lastGeneratedReport = report;
        }
        
        const pdfInfo = await window.aiReportGenerator.exportToPDF(report);
        this.addMessage(`✅ **PDF Report Generated Successfully!**\n\n📁 **File:** ${pdfInfo.filename}\n📊 **Pages:** ${pdfInfo.pages}\n📅 **Generated:** ${new Date().toLocaleString()}\n\nThe PDF has been downloaded to your device.`, 'ai');
        
      } catch (error) {
        this.addMessage(`❌ Error generating PDF: ${error.message}`, 'ai');
      }
      return; // Don't send the message to AI
    }
  }

  // Clear chat messages
  clearChat() {
    const list = this.panelEl.querySelector('#chatMessagesList');
    if (list) {
      list.innerHTML = '';
      this.addMessage('Chat cleared. How can I help you today?', 'ai');
    }
  }
  
  // Handle data loaded event
  onDataLoaded(dataInfo) {
    console.log('📊 Enhanced Chat Panel: Processing data loaded event');
    
    // Update the welcome message to reflect loaded data
    const welcomeMessage = this.panelEl.querySelector('.welcome-message .welcome-content');
    if (welcomeMessage) {
      const tipElement = welcomeMessage.querySelector('.welcome-tip');
      if (tipElement) {
        tipElement.innerHTML = `<strong>🚀 Data Loaded!</strong> I now have access to ${dataInfo.count} site records. Try: "Analyze my ${dataInfo.count} sites" or "What insights can you find?"`;
        tipElement.style.color = '#10b981';
      }
    }
    
    // Add a notification message to chat
    setTimeout(() => {
      this.addMessage(`🚀 **Data Successfully Loaded!**\n\nI now have access to ${dataInfo.count} site records from your Google Sheets data.\n\n**Ready to analyze:**\n• Geographic distribution\n• Site status and performance\n• Technology breakdown\n• Coverage patterns\n\nWhat would you like me to analyze first?`, 'ai');
    }, 1000);
  }
}

// Initialize globally
window.enhancedChat = new EnhancedChatPanel();