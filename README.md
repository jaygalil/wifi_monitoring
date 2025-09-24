# 🇵🇭 Philippines Region 2 Site Tracker Dashboard

A comprehensive web-based dashboard for monitoring and analyzing telecommunications site data across Philippines Region 2, featuring advanced AI-powered insights, interactive mapping, and data visualization capabilities.

## 🚀 Features

### 📊 **Data Management**
- **Google Sheets Integration**: Direct data loading from Google Sheets
- **Real-time Data Processing**: Live data updates and synchronization
- **Multi-format Support**: CSV, Excel, and API data sources
- **Auto-configuration System**: Secure API key management with local storage

### 🗺️ **Interactive Mapping**
- **Leaflet-powered Maps**: High-performance interactive mapping
- **Multiple Map Layers**: OpenStreetMap, satellite, and terrain views
- **Site Visualization**: Color-coded markers for different site types
- **Cluster Analysis**: Automatic grouping of nearby sites
- **Geographic Insights**: Coverage analysis and gap identification

### 🤖 **AI-Powered Analytics**
- **Advanced AI Assistant**: Multiple AI provider support (DeepSeek, OpenRouter, Local)
- **Natural Language Queries**: Ask questions about your data in plain English
- **Smart Insights**: Automated pattern detection and analysis
- **Issue Detection**: Automatic identification of connectivity problems
- **Optimization Suggestions**: AI-recommended network improvements

### 📈 **Data Visualization**
- **Interactive Charts**: Dynamic charts and graphs using Chart.js
- **Performance Metrics**: Real-time KPI monitoring
- **Trend Analysis**: Historical data visualization
- **Custom Dashboards**: Configurable data views
- **Export Capabilities**: PDF and image export options

### 💬 **Enhanced Chat Interface**
- **Side-mounted Chat Panel**: Resizable, professional chat interface
- **Quick Actions**: Preset commands for common tasks
- **Real-time AI Responses**: Instant analysis and insights
- **Multi-provider Support**: Seamless switching between AI providers
- **Conversation History**: Persistent chat sessions

## 🛠️ **Technology Stack**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js with custom plugins
- **Charts**: Chart.js for data visualization
- **AI Integration**: Multiple provider APIs (DeepSeek, OpenRouter)
- **Styling**: Bootstrap 5 with custom CSS
- **Icons**: Font Awesome for UI elements

## 🏗️ **Project Structure**

```
Site_tracler/
├── index.html                    # Main dashboard interface
├── ai-assistant.js              # Core AI functionality
├── ai-advanced-features.js      # Advanced AI capabilities
├── enhanced-chat-panel.js       # Modern chat interface
├── ai-mapping-features.js       # AI-powered mapping tools
├── auto-config.js              # Configuration management
├── config.js                   # API keys and settings
├── deepseek-fix.js             # DeepSeek API integration
├── ai-chat-fix.js              # Chat system fixes
├── app.py                      # Python backend (optional)
├── DEEPSEEK_SETUP_GUIDE.md     # DeepSeek configuration guide
├── OPENROUTER_SETUP_GUIDE.md   # OpenRouter setup instructions
└── README.md                   # This file
```

## 🚀 **Quick Start**

### 1. **Clone the Repository**
```bash
git clone https://github.com/jaygalil/wifi_monitoring.git
cd wifi_monitoring
```

### 2. **Configure API Keys**
- Copy `config.js` and add your API keys:
  ```javascript
  window.CONFIG = {
      DEEPSEEK_API_KEY: 'your-deepseek-key',
      OPENROUTER_API_KEY: 'your-openrouter-key',
      GOOGLE_SHEETS_API_KEY: 'your-sheets-key'
  };
  ```

### 3. **Open in Browser**
- Open `index.html` in a modern web browser
- The auto-config system will load your settings automatically

### 4. **Load Your Data**
- Click "Load from Google Sheets" in the sidebar
- Enter your Google Sheets URL
- Or upload CSV/Excel files directly

## 📋 **Setup Guides**

### **DeepSeek AI Setup**
See [DEEPSEEK_SETUP_GUIDE.md](DEEPSEEK_SETUP_GUIDE.md) for detailed instructions on:
- Creating DeepSeek account
- Obtaining API keys
- Configuration steps
- Usage examples

### **OpenRouter Setup**
See [OPENROUTER_SETUP_GUIDE.md](OPENROUTER_SETUP_GUIDE.md) for:
- OpenRouter account creation
- API key generation
- Model selection
- Integration guide

## 🎯 **Use Cases**

### **Network Planning**
- Analyze coverage gaps in Philippines Region 2
- Identify optimal locations for new sites
- Assess network capacity requirements

### **Performance Monitoring**
- Track site uptime and connectivity
- Monitor bandwidth utilization
- Detect performance anomalies

### **Geographic Analysis**
- Visualize site distribution across provinces
- Analyze coverage by municipality
- Identify underserved areas

### **AI-Powered Insights**
- Natural language data queries
- Automated issue detection
- Optimization recommendations
- Trend analysis and forecasting

## 🔧 **Configuration Options**

### **Auto-Config System**
The dashboard includes an intelligent configuration system that:
- Auto-loads API keys from local storage
- Tests connections on startup
- Provides visual feedback for configuration status
- Supports multiple storage methods (localStorage, sessionStorage)

### **AI Provider Selection**
Choose from multiple AI providers:
- **DeepSeek**: Cost-effective, high-quality responses
- **OpenRouter**: Access to multiple models (GPT, Claude, etc.)
- **Local AI**: Offline processing for sensitive data

### **Map Customization**
- Multiple tile layers (OpenStreetMap, Satellite, Terrain)
- Custom marker styles and colors
- Clustering algorithms for site grouping
- Overlay support for coverage areas

## 🌟 **Key Features in Detail**

### **Smart Data Analysis**
- Automatic detection of data patterns
- Geographic clustering analysis
- Performance trend identification
- Anomaly detection algorithms

### **Interactive Visualizations**
- Drill-down capability on all charts
- Real-time data updates
- Custom time range selection
- Multi-dimensional data views

### **Professional Chat Interface**
- Resizable side panel (300-600px width)
- Quick action buttons for common tasks
- Typing indicators and message timestamps
- Mobile-responsive design

## 📱 **Mobile Support**

The dashboard is fully responsive and optimized for:
- Desktop computers (1920x1080+)
- Tablets (768px - 1024px)
- Mobile phones (320px - 767px)
- Touch interfaces with gesture support

## 🔐 **Security Features**

- **Local API Key Storage**: Keys stored locally, never transmitted
- **HTTPS Support**: Secure connections to all external APIs
- **Input Validation**: XSS and injection protection
- **Rate Limiting**: Built-in API call throttling

## 🤝 **Contributing**

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📊 **Performance**

- **Load Time**: < 3 seconds on modern browsers
- **Data Processing**: Handles 10,000+ sites efficiently
- **Map Rendering**: Smooth interaction with 1,000+ markers
- **AI Response Time**: Typically < 5 seconds per query

## 📞 **Support**

For questions or issues:
- Create an issue on GitHub
- Check the setup guides for common problems
- Review the configuration documentation

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Philippines Region 2 telecommunications monitoring**

*Empowering data-driven decisions through intelligent visualization and AI-powered insights.*