import express from 'express';

import api from './modules/api';
import uploader from './modules/uploader';

const appName = process.env.APP_NAME || 'Saturn';
const port = process.env.PORT || 9090;

const app = express();

api(app);
uploader(app);

app.listen(port, function() {
    console.info(appName + ' running on port ' + port + '.');
});
