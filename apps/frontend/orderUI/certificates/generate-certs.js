const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = __dirname;
const keyPath = path.join(certDir, 'localhost-key.pem');
const certPath = path.join(certDir, 'localhost.pem');

console.log('🔐 Generating SSL certificates for local development...');

// Check if OpenSSL is available
function checkOpenSSL() {
  try {
    execSync('openssl version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Generate certificates using OpenSSL if available
function generateWithOpenSSL() {
  try {
    console.log('📝 Generating private key...');
    execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: 'inherit' });
    
    console.log('📜 Generating certificate...');
    const opensslConfig = `
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = State
L = City
O = Organization
OU = Organizational Unit
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
`;

    const configPath = path.join(certDir, 'openssl.conf');
    fs.writeFileSync(configPath, opensslConfig);
    
    execSync(`openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days 365 -config "${configPath}" -extensions v3_req`, { stdio: 'inherit' });
    
    // Clean up config file
    fs.unlinkSync(configPath);
    
    return true;
  } catch (error) {
    console.error('❌ Error with OpenSSL:', error.message);
    return false;
  }
}

// Generate basic self-signed certificate using Node.js crypto
function generateWithNodeJS() {
  try {
    console.log('📝 Generating certificates using Node.js crypto...');
    
    const crypto = require('crypto');
    const forge = require('node-forge');
    
    // Generate a key pair
    const keys = forge.pki.rsa.generateKeyPair(2048);
    
    // Create a certificate
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    
    const attrs = [{
      name: 'commonName',
      value: 'localhost'
    }, {
      name: 'countryName',
      value: 'US'
    }, {
      name: 'stateOrProvinceName',
      value: 'State'
    }, {
      name: 'localityName',
      value: 'City'
    }, {
      name: 'organizationName',
      value: 'Organization'
    }];
    
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    
    // Add subject alternative names
    cert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'subjectAltName',
      altNames: [{
        type: 2, // DNS
        value: 'localhost'
      }, {
        type: 7, // IP
        ip: '127.0.0.1'
      }]
    }]);
    
    // Sign the certificate
    cert.sign(keys.privateKey);
    
    // Convert to PEM format
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    const certPem = forge.pki.certificateToPem(cert);
    
    // Write files
    fs.writeFileSync(keyPath, privateKeyPem);
    fs.writeFileSync(certPath, certPem);
    
    return true;
  } catch (error) {
    console.error('❌ Error with Node.js crypto:', error.message);
    return false;
  }
}

// Main execution
if (checkOpenSSL()) {
  if (generateWithOpenSSL()) {
    console.log('✅ SSL certificates generated successfully with OpenSSL!');
  } else {
    console.log('❌ Failed to generate certificates with OpenSSL');
    process.exit(1);
  }
} else {
  console.log('⚠️  OpenSSL not found. Trying alternative method...');
  
  // Try to install node-forge if not available
  try {
    require('node-forge');
  } catch (error) {
    console.log('📦 Installing node-forge for certificate generation...');
    try {
      execSync('npm install node-forge', { stdio: 'inherit' });
    } catch (installError) {
      console.error('❌ Failed to install node-forge:', installError.message);
      console.log('');
      console.log('💡 Manual certificate generation options:');
      console.log('   1. Install OpenSSL for Windows: https://slproweb.com/products/Win32OpenSSL.html');
      console.log('   2. Use mkcert: https://github.com/FiloSottile/mkcert');
      console.log('   3. Use online certificate generators');
      process.exit(1);
    }
  }
  
  if (generateWithNodeJS()) {
    console.log('✅ SSL certificates generated successfully with Node.js!');
  } else {
    console.log('❌ Failed to generate certificates');
    process.exit(1);
  }
}

console.log(`📁 Private key: ${keyPath}`);
console.log(`📁 Certificate: ${certPath}`);
console.log('');
console.log('🚀 You can now run your dev server with HTTPS enabled.');
console.log('⚠️  Note: You may need to accept the self-signed certificate in your browser.');
console.log('');
console.log('🔧 Usage:');
console.log('   npm run dev          # Start with HTTPS');
console.log('   npm run dev:http     # Start with HTTP (fallback)');

