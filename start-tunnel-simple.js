const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting CLARA AI Receptionist with Public Tunnel');
console.log('📡 Setting up development tunnel...');

// Try to start ngrok tunnel
function startNgrok() {
    return new Promise((resolve, reject) => {
        console.log('📡 Starting ngrok tunnel...');
        
        const ngrok = spawn('ngrok', ['http', '3000'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
        });

        let output = '';
        let tunnelUrl = null;
        
        ngrok.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log('ngrok:', text);
            
            // Look for the tunnel URL in the output
            const urlMatch = text.match(/https:\/\/[a-z0-9-]+\.ngrok\.io/);
            if (urlMatch && !tunnelUrl) {
                tunnelUrl = urlMatch[0];
                console.log('✅ Ngrok tunnel started successfully!');
                console.log('🌐 Public URL:', tunnelUrl);
                console.log('📱 QR codes will now work on mobile devices!');
                console.log('');
                console.log('🎯 Test URLs:');
                console.log(`   Main Interface: ${tunnelUrl}`);
                console.log(`   Mobile Test: ${tunnelUrl}/mobile-qr-test.html`);
                console.log(`   Presentation Test: ${tunnelUrl}/presentation-qr-test.html`);
                console.log('');
                console.log('📱 Scan QR codes with your mobile device to test!');
                console.log('🛑 Press Ctrl+C to stop the tunnel');
                
                // Save tunnel configuration
                saveTunnelConfig(tunnelUrl);
                resolve(tunnelUrl);
            }
        });

        ngrok.stderr.on('data', (data) => {
            console.error('ngrok error:', data.toString());
        });

        ngrok.on('close', (code) => {
            console.log(`ngrok process exited with code ${code}`);
        });

        // Timeout after 15 seconds
        setTimeout(() => {
            if (!tunnelUrl) {
                ngrok.kill();
                reject(new Error('ngrok timeout - could not establish tunnel'));
            }
        }, 15000);
    });
}

function saveTunnelConfig(tunnelUrl) {
    const config = {
        tunnelUrl: tunnelUrl,
        localUrl: 'http://localhost:3000',
        timestamp: new Date().toISOString(),
        status: 'active'
    };

    const configPath = path.join(__dirname, 'tunnel-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('💾 Tunnel configuration saved');
}

// Start the tunnel
startNgrok().catch(error => {
    console.error('❌ Failed to start tunnel:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure ngrok is installed: npm install -g ngrok');
    console.log('   2. Make sure the server is running on port 3000');
    console.log('   3. Check your internet connection');
    console.log('   4. Try running: ngrok http 3000');
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down tunnel...');
    process.exit(0);
});
