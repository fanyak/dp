import express from 'express'; // node modules
import ssr from './ssr.mjs';

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
// import cors from 'cors'

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// app.use(cors())

// work around for using __dirname when using ES6 modules
/* eslint-disable no-alert */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WEB_PATH = path.join(__dirname, ''); // change to 'public'?

const fileServer = express.static(WEB_PATH, { // OPTIONS OBJECT 
  setHeaders(res, path) {
      const parts = path.split('.');
      if (['mjs', 'js'].includes(parts.at(-1)) ) {
          // JUST TO MAKE SURE THAT IT IS SERVED AS JAVASCRIPT
          // REF: https://v8.dev/features/modules#mjs
          res.setHeader('Content-Type', 'text/javascript');
      }
  }
});

app.use(fileServer);

app.get('/', async (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}/index.html`)
  // parse the html using puppeteer and send it as the response
  const {html, ttRenderMs} = await ssr(`${req.protocol}://${req.get('host')}/index.html`);
  // Add Server-Timing! See https://w3c.github.io/server-timing/.
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).send(html); // Serve prerendered page as response.
});

app.get('/posts', async (req, res, next) => {
  let posts = '';
  fs.readFile('./post.json', 'utf8', (error, data) => {
    console.log(error)
    posts = data;
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(posts); // Serve prerendered page as response.
  });  
 
});


app.listen(8080, () => console.log('Server started. Press Ctrl+C to quit'));