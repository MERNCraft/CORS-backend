require('dotenv').config()
const PORT = process.env.PORT || 3000

// Initialize the Express app
const express = require('express')
const app = express()
const cors = require('cors')

// Only authorize 2 origins
const corsOptions = {
  origin: [
    /^HTTP:\/\/LOCALHOST:/i,
    "http://127.0.0.1:3000"
  ]
}
app.use(cors(corsOptions))


app.get('/', (req, res) => {
  // Respond to a request with a timed message giving
  // the URL to where the server received the request
  const { protocol, hostname } = req
  const message = `<pre>
Connected to ${protocol}://${hostname}:${PORT}
${Date()}
</pre>`

  res.send(message)
})


app.get('/headers', (req, res) => {
  const message = `<pre>
${JSON.stringify(req.headers, null, "  ")}
</pre>`

  res.send(message)
})


app.get('/invitation-only', (req, res) => {
  const origin = req.get("origin")
  console.log("origin:", origin);
  // `req.headers.origin`, sent from the browser, will
  // be either undefined or a string

  const allowed = res.get("access-control-allow-origin")
  // After treatment by `cors, the response header for
  // "access-control-allow-origin" will be one of:
  // - undefined
  // - "*"
  // - the same string as origin
  console.log("allowed:", allowed);

  // If a direct request is made from the browser's
  // address bar, ``req.headers.origin`` will be undefined,
  // so cors will not set the "access-control-allow-origin"
  // header. This means that `allowed` will also be
  // undefined, and therefore === `origin`, even though it
  // is not a string.
  const ok = (allowed === origin || allowed === "*")
  console.log("ok", ok)

  // Only use server CPU time and bandwidth if the request
  // came from a whitelisted origin. If not, send an empty
  // message.
  const message = ok
    ? "TODO: DATABASE STUFF TO GENERATE A REAL MESSAGE"
    : ""

  res.send(message)
})


app.listen(PORT, optionalCallbackForListen)


//Print out some useful information in the Terminal
function optionalCallbackForListen() {
  // Check what IP addresses are used by your
  // development computer.
  const nets = require("os").networkInterfaces()
  const ips = Object.values(nets)
  .flat()
  .filter(({ family }) => (
    family === "IPv4")
  )
  .map(({ address }) => address)

  // ips will include `127.0.0.1` which is the
  // "loopback" address for your computer. This
  // address is not accessible from other
  // computers on your network. The host name
  // "localhost" can be used as an alias for
  // `127.0.0.1`, so you can add that, too.
  ips.unshift("localhost")

  // Show in the Terminal the URL(s) where you
  // can connect to your server
  const hosts = ips.map( ip => (
    `http://${ip}:${PORT}`)
  ).join("\n  ")
  console.log(`Express server listening at:
  ${hosts}`);
}