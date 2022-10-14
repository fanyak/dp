import express from 'express'; // node modules
import compression from 'compression';

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// work around for using __dirname when using ES6 modules
/* eslint-disable no-alert */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// used in res.sendFile(path.join(WEB_PATH, file.name))
const WEB_PATH = path.join(__dirname, ''); // change to 'public'?

const app = express();

app.use(express.json());

//@TODO: // Add Server-Timing! See https://w3c.github.io/server-timing/.

// set up server for static files html/css/js
const fileServer = express.static(WEB_PATH, { // OPTIONS OBJECT 
    setHeaders(res, path) {
        const parts = path.split('.');
        if (['mjs', 'js'].includes(parts.at(-1)) ) {
            //  TO MAKE SURE THAT ESMODULE IS SERVED AS JAVASCRIPT
            // REF: https://v8.dev/features/modules#mjs
            res.setHeader('Content-Type', 'text/javascript');
        }
    }
});
  
app.use(fileServer);

app.use(async (req, res, next) => { 
    if (req.url === '/posts') {
        res.setHeader('content-type', 'application/json');        
        res.status(200).sendFile(path.join(WEB_PATH, 'post.json'));
    }

    if (req.url === '/posts-stream') {
        res.setHeader('Server-Timing', `streaming;dur=${Date.now()};desc="streaming start"`);
        res.setHeader('content-type', 'application/json');
        // res.status(200).sendFile(path.join(WEB_PATH, 'posts-stream.json'));

        res.status(200);   
        const readStream = fs.createReadStream(path.join(WEB_PATH, 'posts-stream.json'));
        // This is where the magic happens: set a stream as the response body
        //res.send(readStream) 
        readStream.pipe(res);
    }
});

app.listen(8080, () => console.log('Server started. Press Ctrl+C to quit'));