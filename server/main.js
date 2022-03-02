const express = require('express');
const fs = require('fs');

// Create our express app using the port optionally specified
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  '/integrations-demo/build',
  express.static(fs.realpathSync('./build'))
);

app.use(
  '/integrations-demo',
  express.static(fs.realpathSync('./integrations-demo/visual-inspection-tool'))
);

app.use('/jsdoc', express.static(fs.realpathSync('./out')));

app.use('/', express.static(fs.realpathSync('./build')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
