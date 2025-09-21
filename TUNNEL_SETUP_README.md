# 🌐 CLARA AI Receptionist - Public Tunnel Setup

This guide will help you set up a public tunnel so that mobile devices can access your CLARA AI Receptionist system and scan QR codes properly.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the automated tunnel setup
start-with-tunnel.bat
```

### Option 2: Manual Setup
```bash
# Terminal 1: Start the server
node server.js

# Terminal 2: Start the tunnel
node start-tunnel-simple.js
```

## 📱 What This Enables

- ✅ **Mobile QR Code Scanning**: QR codes work on any mobile device
- ✅ **Public Access**: Anyone can scan QR codes from anywhere
- ✅ **Presentation Ready**: Perfect for demos and presentations
- ✅ **No Network Configuration**: Works through any firewall/NAT

## 🔧 How It Works

1. **Local Server**: Runs on `http://localhost:3000`
2. **Public Tunnel**: Creates a public URL (e.g., `https://abc123.ngrok.io`)
3. **QR Code Generation**: Uses public URL for mobile compatibility
4. **Mobile Scanning**: QR codes redirect to public URL

## 📋 Files Created

- `setup-tunnel.js` - Advanced tunnel manager
- `start-tunnel-simple.js` - Simple tunnel setup
- `start-with-tunnel.bat` - Windows batch file for easy startup
- `tunnel-test.html` - Test page for tunnel functionality
- `tunnel-config.json` - Configuration file (auto-generated)

## 🧪 Testing

### 1. Check Tunnel Status
Visit: `http://localhost:3000/tunnel-test.html`

### 2. Test Mobile QR Codes
- Generate QR codes in the main interface
- Scan with your mobile device
- Should redirect to appointment details page

### 3. Direct Mobile Testing
Use the public URL provided by the tunnel:
- Main Interface: `https://your-tunnel-url.ngrok.io`
- Mobile Test: `https://your-tunnel-url.ngrok.io/mobile-qr-test.html`
- Presentation Test: `https://your-tunnel-url.ngrok.io/presentation-qr-test.html`

## 🎯 For Your Presentation

1. **Start the tunnel** before your presentation
2. **Note the public URL** (e.g., `https://abc123.ngrok.io`)
3. **Generate QR codes** - they'll automatically use the public URL
4. **Scan with mobile** - works perfectly for demos!

## 🔧 Troubleshooting

### Tunnel Won't Start
```bash
# Install ngrok globally
npm install -g ngrok

# Or try alternative
npx localtunnel --port 3000
```

### QR Codes Don't Work on Mobile
1. Check tunnel status at `/tunnel-test.html`
2. Ensure tunnel URL is active
3. Try regenerating QR codes

### Server Not Running
```bash
# Make sure you're in the correct directory
cd CLARA-A

# Start the server
node server.js
```

## 📱 Mobile Testing Checklist

- [ ] Tunnel is active (green status)
- [ ] Public URL is accessible
- [ ] QR code generates successfully
- [ ] Mobile device can scan QR code
- [ ] QR code redirects to appointment page
- [ ] Appointment page loads correctly on mobile

## 🎉 Success!

When everything is working:
- ✅ Tunnel shows green status
- ✅ QR codes contain public URLs
- ✅ Mobile devices can scan and access
- ✅ Perfect for presentations and demos!

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify ngrok is installed: `ngrok version`
3. Ensure port 3000 is not blocked
4. Try restarting both server and tunnel

---

**Ready for your presentation! 🎯**
