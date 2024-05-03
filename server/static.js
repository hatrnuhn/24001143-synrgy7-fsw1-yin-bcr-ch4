const fs = require('fs/promises');
const {ReasonPhrases, StatusCodes} = require('http-status-codes');
const respond = require('./response.js');
const path = require('path');


const serveStatic = async (data, res) => {
    try {
        const {
            url,
            path: pathname,
            queryString: qs,
            headers,
            method,
            buffer    
        } = data;

        // based on the URL path, extract the file extension. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        
        const map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword'
        };

        await fs.access(pathname, fs.constants.F_OK | fs.constants.R_OK);

        const file = await fs.readFile(pathname);
        res.setHeader('Content-type', map[ext] || 'text/plain' );
        res.end(file);      
    } catch (err) {
        if (err.code === 'ENOENT') {
            respond.withError(res, StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
        } else respond.withError(res, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {serveStatic};