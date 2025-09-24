/**
 * Centralized Toast Notification Manager
 * Prevents overlapping notifications by managing a queue and positioning
 */
class ToastManager {
    constructor() {
        this.toasts = [];
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container
        this.createContainer();
        
        // Add styles
        this.addStyles();
    }

    createContainer() {
        if (document.getElementById('toast-container')) return;
        
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    addStyles() {
        if (document.getElementById('toast-manager-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'toast-manager-styles';
        styles.textContent = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                pointer-events: none;
                max-width: 400px;
            }

            .toast-notification {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                margin-bottom: 10px;
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .toast-notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .toast-notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .toast-notification.success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            }

            .toast-notification.warning {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
            }

            .toast-notification.error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
            }

            .toast-notification.info {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
            }

            .toast-header {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                font-weight: 600;
            }

            .toast-header i {
                margin-right: 8px;
                font-size: 16px;
            }

            .toast-body {
                font-size: 13px;
                line-height: 1.4;
                opacity: 0.95;
            }

            .toast-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .toast-close:hover {
                opacity: 1;
            }

            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                transition: width linear;
            }

            @media (max-width: 768px) {
                .toast-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }

                .toast-notification {
                    margin-bottom: 8px;
                    padding: 12px 16px;
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    show(options) {
        const {
            title = '',
            message = '',
            type = 'info',
            duration = 5000,
            icon = this.getDefaultIcon(type),
            closable = true
        } = options;

        const toast = this.createToast({
            title,
            message,
            type,
            duration,
            icon,
            closable
        });

        this.toasts.push(toast);
        this.container.appendChild(toast.element);

        // Show toast with animation
        setTimeout(() => {
            toast.element.classList.add('show');
        }, 10);

        // Auto-remove if duration is set
        if (duration > 0) {
            toast.progressBar.style.width = '100%';
            toast.progressBar.style.transitionDuration = `${duration}ms`;
            
            setTimeout(() => {
                this.hide(toast.id);
            }, duration);
        }

        return toast.id;
    }

    createToast({ title, message, type, duration, icon, closable }) {
        const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        const element = document.createElement('div');
        element.className = `toast-notification ${type}`;
        element.setAttribute('data-toast-id', id);

        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress';
        progressBar.style.width = '0%';

        element.innerHTML = `
            ${title ? `
                <div class="toast-header">
                    <i class="${icon}"></i>
                    ${title}
                </div>
            ` : ''}
            <div class="toast-body">
                ${message}
            </div>
            ${closable ? '<button class="toast-close" onclick="toastManager.hide(\'' + id + '\')">×</button>' : ''}
        `;

        element.appendChild(progressBar);

        return {
            id,
            element,
            progressBar,
            type,
            duration
        };
    }

    hide(toastId) {
        const toast = this.toasts.find(t => t.id === toastId);
        if (!toast) return;

        toast.element.classList.add('hide');
        
        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.remove();
            }
            this.toasts = this.toasts.filter(t => t.id !== toastId);
        }, 300);
    }

    hideAll() {
        this.toasts.forEach(toast => {
            this.hide(toast.id);
        });
    }

    getDefaultIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    // Convenience methods
    success(title, message, duration = 5000) {
        return this.show({ title, message, type: 'success', duration });
    }

    error(title, message, duration = 7000) {
        return this.show({ title, message, type: 'error', duration });
    }

    warning(title, message, duration = 6000) {
        return this.show({ title, message, type: 'warning', duration });
    }

    info(title, message, duration = 5000) {
        return this.show({ title, message, type: 'info', duration });
    }
}

// Initialize global toast manager
const toastManager = new ToastManager();
window.toastManager = toastManager;

// Legacy compatibility functions
window.showToast = (message, type = 'info', duration = 5000) => {
    return toastManager.show({ message, type, duration });
};

console.log('🍞 Toast Manager initialized');