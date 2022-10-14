import express from 'express'; // node modules
import compression from 'compression';
import ssr from './ssr.mjs';

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
// import cors from 'cors'

const app = express();

app.get('/', async (req, res, next) => {
  console.log(1111)
  console.log(`${req.protocol}://${req.get('host')}/index.html`)
  // parse the html using puppeteer and send it as the response
  const {html, ttRenderMs} = await ssr(`${req.protocol}://${req.get('host')}/index.html`);
  // Add Server-Timing! See https://w3c.github.io/server-timing/.
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).set({ 'Content-Type': 'text/html' }).send(html); // Serve prerendered page as response.
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// @NOTE: USE CORS
// app.use(cors())

// work around for using __dirname when using ES6 modules
/* eslint-disable no-alert */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WEB_PATH = path.join(__dirname, ''); // change to 'public'?

// set up server for static files html/css/js
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

//@NOTE: USE compression
// function shouldCompress (req, res) {
//   if (req.headers['x-no-compression']) {
//     // don't compress responses with this request header
//     return false
//   }

//   // fallback to standard filter function
//   return compression.filter(req, res)
// }
// use compression
// app.use(compression({ filter: shouldCompress }));

// @TODO: USE HTTP2 with HTTPS
// REF: https://towardsdev.com/upgrading-your-express-server-to-http-2-with-4-lines-of-code-14a287497ca2



app.get('/posts', async (req, res, next) => {
  // let posts = '';
  // fs.readFile('./post.json', 'utf8', (error, data) => {
  //   posts = data;
  //   res.setHeader('Content-Type', 'application/json');
  //   return res.status(200).send(posts); // Serve prerendered page as response.
  // }); 
  res.setHeader('Content-Type', 'application/json');
  res.status(200).sendFile(path.join(WEB_PATH, 'post.json'));
 
});


app.listen(8080, () => console.log('Server started. Press Ctrl+C to quit'));