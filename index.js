import express from 'express';

import api from './modules/api';

const appName = process.env.APP_NAME || 'Saturn';
const port = process.env.PORT || 9090;

const app = express();

api(app);

app.listen(port, function() {
    console.info(appName + ' running on port ' + port + '.');
});
