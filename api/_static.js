// Vercel function to serve static files
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const url = req.url;
    
    // Handle CSS files
    if (url.endsWith('.css')) {
        const cssPath = path.join(__dirname, '../public', url);
        if (fs.existsSync(cssPath)) {
            res.setHeader('Content-Type', 'text/css');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.sendFile(cssPath);
            return;
        }
    }
    
    // Handle JS files
    if (url.endsWith('.js')) {
        const jsPath = path.join(__dirname, '../public', url);
        if (fs.existsSync(jsPath)) {
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.sendFile(jsPath);
            return;
        }
    }
    
    // Handle other static files
    const filePath = path.join(__dirname, '../public', url);
    if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        
        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'application/javascript';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.sendFile(filePath);
        return;
    }
    
    // For API routes, continue to main server
    if (url.startsWith('/api/')) {
        res.status(404).send('API route not found');
        return;
    }
    
    // For all other routes, serve index.html (SPA)
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../public/index.html'));
};