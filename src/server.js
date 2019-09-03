const next = require('next');
const express = require('express');

process.stdout.write('Starting EC2 Launch Wizard...\n');

const app = next({ dir: __dirname, dev: true });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('*', (req, res) => handle(req, res));

    server.listen(8080, '0.0.0.0', (err) => {
      if (err) throw err;

      process.stdout.write('Listening on http://localhost:8080 ...\n');
    });
  })
  .catch((ex) => {
    process.stderr.write(ex.stack);
    process.exit(1);
  });
