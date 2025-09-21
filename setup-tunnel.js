const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TunnelManager {
    constructor() {
        this.tunnelUrl = null;
        this.tunnelProcess = null;
    }

    async startTunnel() {
        console.log('🚀 Starting development tunnel...');
        
        try {
            // Try ngrok first
            await this.startNgrokTunnel();
        } catch (error) {
            console.log('❌ Ngrok failed, trying alternative...');
            try {
                // Try cloudflare tunnel
                await this.startCloudflareTunnel();
            } catch (error2) {
                console.log('❌ Cloudflare tunnel failed, using localtunnel...');
                await this.startLocaltunnel();
            }
        }
    }

    async startNgrokTunnel() {
        return new Promise((resolve, reject) => {
            console.log('📡 Starting ngrok tunnel...');
            
            const ngrok = spawn('ngrok', ['http', '3000', '--log=stdout'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let output = '';
            
            ngrok.stdout.on('data', (data) => {
                output += data.toString();
                console.log('ngrok:', data.toString());
                
                // Look for the tunnel URL
                const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok\.io/);
                if (urlMatch) {
                    this.tunnelUrl = urlMatch[0];
                    this.tunnelProcess = ngrok;
                    console.log('✅ Ngrok tunnel started:', this.tunnelUrl);
                    this.updateQRCodeGeneration();
                    resolve(this.tunnelUrl);
                }
            });

            ngrok.stderr.on('data', (data) => {
                console.error('ngrok error:', data.toString());
            });

            ngrok.on('close', (code) => {
                console.log(`ngrok process exited with code ${code}`);
                if (code !== 0) {
                    reject(new Error(`ngrok exited with code ${code}`));
                }
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!this.tunnelUrl) {
                    ngrok.kill();
                    reject(new Error('ngrok timeout'));
                }
            }, 10000);
        });
    }

    async startCloudflareTunnel() {
        return new Promise((resolve, reject) => {
            console.log('📡 Starting cloudflare tunnel...');
            
            // Install cloudflared if not available
            const cloudflared = spawn('cloudflared', ['tunnel', '--url', 'http://localhost:3000'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let output = '';
            
            cloudflared.stdout.on('data', (data) => {
                output += data.toString();
                console.log('cloudflared:', data.toString());
                
                // Look for the tunnel URL
                const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
                if (urlMatch) {
                    this.tunnelUrl = urlMatch[0];
                    this.tunnelProcess = cloudflared;
                    console.log('✅ Cloudflare tunnel started:', this.tunnelUrl);
                    this.updateQRCodeGeneration();
                    resolve(this.tunnelUrl);
                }
            });

            cloudflared.stderr.on('data', (data) => {
                console.error('cloudflared error:', data.toString());
            });

            cloudflared.on('close', (code) => {
                console.log(`cloudflared process exited with code ${code}`);
                if (code !== 0) {
                    reject(new Error(`cloudflared exited with code ${code}`));
                }
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!this.tunnelUrl) {
                    cloudflared.kill();
                    reject(new Error('cloudflared timeout'));
                }
            }, 10000);
        });
    }

    async startLocaltunnel() {
        return new Promise((resolve, reject) => {
            console.log('📡 Starting localtunnel...');
            
            // Install localtunnel if not available
            const localtunnel = spawn('npx', ['localtunnel', '--port', '3000'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let output = '';
            
            localtunnel.stdout.on('data', (data) => {
                output += data.toString();
                console.log('localtunnel:', data.toString());
                
                // Look for the tunnel URL
                const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.loca\.lt/);
                if (urlMatch) {
                    this.tunnelUrl = urlMatch[0];
                    this.tunnelProcess = localtunnel;
                    console.log('✅ Localtunnel started:', this.tunnelUrl);
                    this.updateQRCodeGeneration();
                    resolve(this.tunnelUrl);
                }
            });

            localtunnel.stderr.on('data', (data) => {
                console.error('localtunnel error:', data.toString());
            });

            localtunnel.on('close', (code) => {
                console.log(`localtunnel process exited with code ${code}`);
                if (code !== 0) {
                    reject(new Error(`localtunnel exited with code ${code}`));
                }
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!this.tunnelUrl) {
                    localtunnel.kill();
                    reject(new Error('localtunnel timeout'));
                }
            }, 10000);
        });
    }

    updateQRCodeGeneration() {
        if (!this.tunnelUrl) return;

        console.log('🔄 Updating QR code generation to use tunnel URL...');
        
        // Create a configuration file with the tunnel URL
        const config = {
            tunnelUrl: this.tunnelUrl,
            localUrl: 'http://localhost:3000',
            timestamp: new Date().toISOString()
        };

        fs.writeFileSync(
            path.join(__dirname, 'tunnel-config.json'), 
            JSON.stringify(config, null, 2)
        );

        console.log('✅ Tunnel configuration saved');
        console.log('🌐 Public URL:', this.tunnelUrl);
        console.log('📱 QR codes will now use this public URL for mobile access');
    }

    stopTunnel() {
        if (this.tunnelProcess) {
            console.log('🛑 Stopping tunnel...');
            this.tunnelProcess.kill();
            this.tunnelProcess = null;
            this.tunnelUrl = null;
        }
    }
}

// Start tunnel if this script is run directly
if (require.main === module) {
    const tunnelManager = new TunnelManager();
    
    tunnelManager.startTunnel().catch(error => {
        console.error('❌ Failed to start tunnel:', error.message);
        process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down tunnel...');
        tunnelManager.stopTunnel();
        process.exit(0);
    });
}

module.exports = TunnelManager;
