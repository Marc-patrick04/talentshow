// Vercel Serverless Function for serving static files
module.exports = (req, res) => {
    const url = req.url;
    const path = require('path');
    const fs = require('fs');
    
    // Handle CSS files
    if (url.endsWith('.css')) {
        const filePath = path.join(__dirname, '../public', url);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/css');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.sendFile(filePath);
            return;
        }
    }
    
    // Handle JS files
    if (url.endsWith('.js')) {
        const filePath = path.join(__dirname, '../public', url);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.sendFile(filePath);
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
        else if (ext === '.ico') contentType = 'image/x-icon';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.sendFile(filePath);
        return;
    }
    
    // For API routes, return 404
    if (url.startsWith('/api/')) {
        res.status(404).json({ error: 'API route not found' });
        return;
    }
    
    // For all other routes, serve index.html (SPA)
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '../public/index.html'));
};