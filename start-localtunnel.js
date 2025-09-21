const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting CLARA AI Receptionist with Public Tunnel');
console.log('📡 Setting up localtunnel (no authentication required)...');

// Start localtunnel
function startLocaltunnel() {
    return new Promise((resolve, reject) => {
        console.log('📡 Starting localtunnel...');
        
        const tunnel = spawn('npx', ['localtunnel', '--port', '3000'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
        });

        let output = '';
        let tunnelUrl = null;
        
        tunnel.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log('localtunnel:', text);
            
            // Look for the tunnel URL in the output
            const urlMatch = text.match(/https:\/\/[a-z0-9-]+\.loca\.lt/);
            if (urlMatch && !tunnelUrl) {
                tunnelUrl = urlMatch[0];
                console.log('✅ Localtunnel started successfully!');
                console.log('🌐 Public URL:', tunnelUrl);
                console.log('📱 QR codes will now work on mobile devices!');
                console.log('');
                console.log('🎯 Test URLs:');
                console.log(`   Main Interface: ${tunnelUrl}`);
                console.log(`   Mobile Test: ${tunnelUrl}/mobile-qr-test.html`);
                console.log(`   Tunnel Test: ${tunnelUrl}/tunnel-test.html`);
                console.log(`   Presentation Test: ${tunnelUrl}/presentation-qr-test.html`);
                console.log('');
                console.log('📱 Scan QR codes with your mobile device to test!');
                console.log('🛑 Press Ctrl+C to stop the tunnel');
                
                // Save tunnel configuration
                saveTunnelConfig(tunnelUrl);
                resolve(tunnelUrl);
            }
        });

        tunnel.stderr.on('data', (data) => {
            console.error('localtunnel error:', data.toString());
        });

        tunnel.on('close', (code) => {
            console.log(`localtunnel process exited with code ${code}`);
        });

        // Timeout after 15 seconds
        setTimeout(() => {
            if (!tunnelUrl) {
                tunnel.kill();
                reject(new Error('localtunnel timeout - could not establish tunnel'));
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
startLocaltunnel().catch(error => {
    console.error('❌ Failed to start tunnel:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure the server is running on port 3000');
    console.log('   2. Check your internet connection');
    console.log('   3. Try running: npx localtunnel --port 3000');
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down tunnel...');
    process.exit(0);
});
