# HTTPS Development Setup

This document explains how to run the frontend development server with HTTPS enabled.

## Quick Start

1. **Generate SSL certificates** (first time only):
   ```bash
   pnpm run generate-certs
   ```

2. **Start the development server with HTTPS**:
   ```bash
   pnpm run dev
   ```

3. **Access your application**:
   - HTTPS: https://localhost:3000
   - HTTP (fallback): http://localhost:3000

## Available Scripts

- `pnpm run dev` - Start development server with HTTPS
- `pnpm run dev:http` - Start development server with HTTP only
- `pnpm run generate-certs` - Generate new SSL certificates

## Browser Security Warning

When you first access the HTTPS version, your browser will show a security warning because the certificate is self-signed. This is normal for local development.

### To accept the certificate:

**Chrome/Edge:**
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

**Firefox:**
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

## Certificate Details

- **Location**: `apps/frontend/userUI/certificates/`
- **Files**: 
  - `localhost-key.pem` - Private key
  - `localhost.pem` - Certificate
- **Validity**: 1 year
- **Domains**: localhost, 127.0.0.1, ::1

## Troubleshooting

### Certificate Generation Issues

If certificate generation fails, you have several options:

1. **Install OpenSSL for Windows**:
   - Download from: https://slproweb.com/products/Win32OpenSSL.html
   - Add to PATH and restart terminal

2. **Use mkcert** (recommended for trusted certificates):
   ```bash
   # Install mkcert
   choco install mkcert  # or download from GitHub
   
   # Install root CA
   mkcert -install
   
   # Generate certificates
   mkcert localhost 127.0.0.1 ::1
   
   # Move generated files to certificates directory
   move localhost+2.pem certificates/localhost.pem
   move localhost+2-key.pem certificates/localhost-key.pem
   ```

3. **Use online certificate generators** for development

### Server Won't Start

- Check if port 3000 is already in use: `netstat -ano | findstr :3000`
- Try using a different port: `pnpm run dev --port 3001`
- Check certificate files exist in `certificates/` directory

### HTTPS Not Working

- Verify certificates are in the correct location
- Check browser console for SSL errors
- Try clearing browser cache and cookies
- Use `pnpm run dev:http` as fallback

## Security Notes

- These certificates are for **development only**
- Never use self-signed certificates in production
- The certificates include Subject Alternative Names (SAN) for localhost and IP addresses
- Certificates are valid for 1 year and can be regenerated anytime
