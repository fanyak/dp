// REF: https://vitejs.dev/guide/ssr.html

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

// work around for using __dirname when using ES6 modules
/* eslint-disable no-alert */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {

    const app = express();
    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom'
    });

      // USE vite middleware for index.html
    app.get('/', async (req, res, next) => {
        try {
            // 1. Read index.html
            let template = fs.readFileSync(
                path.resolve(__dirname, 'index.html'),
                'utf-8'
            );

            // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
            //    also applies HTML transforms from Vite plugins, e.g. global preambles
            //    from @vitejs/plugin-react
            template = await vite.transformIndexHtml(req.originalUrl, template);
        
            // 3. Load the server entry. vite.ssrLoadModule automatically transforms
            //    your ESM source code to be usable in Node.js! There is no bundling
            //    required, and provides efficient invalidation similar to HMR.
            const { render } = await vite.ssrLoadModule(`/vite-server.js`);
        
            // 4. render the app HTML. This assumes entry-server.js's exported `render`
            //    function calls appropriate framework SSR APIs,
            //    e.g. ReactDOMServer.renderToString()
            // we need the full ur for puppeteer
            const url = `${req.protocol}://${req.get('host')}/index.html`;
            const appHtml = await render(url);

            // 5. Inject the app-rendered HTML into the template.
            const html = appHtml; // template.replace(`<!--ssr-outlet-->`, appHtml)

            // 6. Send the rendered HTML back.
            res.status(200).set({ 'Content-Type': 'text/html' }).end(appHtml)
        } catch (e) {
        // If an error is caught, let Vite fix the stack trace so it maps back to
        // your actual source code.
            vite.ssrFixStacktrace(e)
            next(e)
        }
    });
    

    // use vite's connect instance as middleware
    // if you use your own express router (express.Router()), you should use router.use
    app.use(vite.middlewares); 

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
    app.get('/posts', async (req, res, next) => {
        // let posts = '';
        // fs.readFile('./post.json', 'utf8', (error, data) => {
        //     posts = data;
        //     res.setHeader('Content-Type', 'application/json');
        //     return res.status(200).send(posts); // Serve prerendered page as response.
        // });         
        res.setHeader('Content-Type', 'application/json');
        res.status(200).sendFile(path.join(WEB_PATH, 'post.json'));        
    });

    app.listen(5173)
}

createServer()
