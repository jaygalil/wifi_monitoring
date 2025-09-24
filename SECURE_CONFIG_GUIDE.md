# 🔒 Secure Auto-Configuration Guide

## ✨ **Convenient & Secure API Key Management**

This system allows you to store your API keys locally and auto-load them securely, so you never have to enter them manually again!

## 🔧 **Setup Instructions**

### **Step 1: Edit config.js**

Open `config.js` and replace the placeholder keys with your real API keys:

```javascript
// Your API Keys (Add your actual keys here - SECURE LOCAL STORAGE)
openrouterApiKey: 'sk-or-v1-YOUR-REAL-OPENROUTER-KEY-HERE', // 🔑 Your OpenRouter key
deepseekApiKey: 'sk-YOUR-REAL-DEEPSEEK-KEY-HERE', // 🔑 Your DeepSeek key

// Google Sheets Configuration  
apiKey: 'AIzaSyA-YOUR-REAL-GOOGLE-SHEETS-KEY-HERE', // 🔑 Your Google Sheets key
sheetId: 'YOUR-REAL-GOOGLE-SHEET-ID-HERE', // 📊 Your Sheet ID
```

### **Step 2: Save & Refresh**

1. **Save the config.js file**
2. **Refresh your browser** (F5 or Ctrl+F5)
3. **See the secure notification** appear confirming keys are loaded
4. **API keys will be automatically masked** in the UI for security

## 🛡️ **Security Features**

### ✅ **What Makes This Secure:**

1. **Local Storage Only**: Keys stored in config.js on your machine only
2. **Git Ignored**: config.js is automatically excluded from version control
3. **UI Masking**: Keys shown as `sk-or-v1-abc•••••••xyz123` in interface
4. **No Network Transmission**: Keys never sent over network except to APIs
5. **Auto-Detection**: System detects and validates key formats

### 🔄 **Auto-Loading Process:**

1. **Dashboard loads** → Reads config.js
2. **Keys validated** → Checks format and availability  
3. **UI populated** → Provider and model auto-selected
4. **Keys masked** → Displayed securely in interface
5. **AI ready** → Chat system uses your configured AI immediately

## 🎯 **Key Formats Expected:**

- **OpenRouter**: `sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **DeepSeek**: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Google Sheets**: `AIzaSyXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 📋 **Example config.js:**

```javascript
const SITE_TRACKER_CONFIG = {
    ai: {
        autoLoadApiKey: true, // ✅ Enable auto-loading
        
        // Your real API keys here
        openrouterApiKey: 'sk-or-v1-1234567890abcdef1234567890abcdef',
        deepseekApiKey: 'sk-1234567890abcdef1234567890abcdef',
        
        defaultProvider: 'openrouter',
        defaultModel: 'deepseek/deepseek-chat',
        autoConnect: true
    },
    
    sheets: {
        autoLoadSheetConfig: true, // ✅ Enable auto-loading
        apiKey: 'AIzaSyA123456789012345678901234567890123',
        sheetId: '1ABCDEFghijklmnopqrstuvwxyz123456789',
        range: 'Sheet1!A:Z',
        autoLoadData: true
    }
};
```

## 🚨 **Important Security Notes:**

⚠️ **DO NOT**:
- Commit config.js to git (it's already ignored)
- Share config.js with others
- Copy-paste keys in public places
- Include keys in screenshots

✅ **DO**:
- Keep config.js on your local machine only
- Use the auto-masking feature for demos
- Regenerate keys if accidentally exposed
- Use different keys for different environments

## 🔄 **Benefits:**

- ✅ **One-time setup**: Configure once, use forever
- ✅ **No manual entry**: Keys auto-load on every refresh
- ✅ **Secure storage**: Local only, never transmitted
- ✅ **Visual masking**: Keys hidden in UI for security
- ✅ **Multiple providers**: Supports OpenRouter, DeepSeek, Google Sheets
- ✅ **Automatic validation**: Checks key format and connectivity

## 🎯 **Usage:**

After setup:
1. **Open dashboard** → Keys auto-load
2. **See notification** → "Secure Auto-Config Loaded"
3. **Chat works immediately** → No manual configuration needed
4. **All AI features active** → Full functionality available

---

**Ready to set up? Edit your config.js file now!** 🚀