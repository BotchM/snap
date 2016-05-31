import {Router} from 'express'
import {loggedin} from '../auth-middleware'

const router = Router()

router.get('/', loggedin, (req, res) => {
  const html = dedent`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8"/>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
      <meta name="viewport" content="user-scalable=no,initial-scale=1.0,maximum-scale=1.0,width=device-width"/>
      <meta name="timestamp" content="${(new Date).toISOString()}"/>
      <title>{title}</title>
    </head>

    <body>
      <h1>Hello Static</h1>
      <div id="app"/>
      <script src="assets/app.js"></script>
    </body>
  </html>
  `
  res.send(html).status(200)
})

export default router