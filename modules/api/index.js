import express from 'express';
import { ParseServer } from 'parse-server';
import bodyParser from 'body-parser';

import parseDashboard from '../dashboard';

const port = process.env.PORT || 9090;
const parseServerApplicationID = process.env.PARSE_SERVER_APPLICATION_ID || 'saturn-id';
const parseServerMasterKey = process.env.PARSE_SERVER_MASTER_KEY || 'saturn-master-key';
const parseServerURL = process.env.PARSE_SERVER_URL || 'http://localhost:' + port + '/parse';
const parseServerCloudCodeMain = process.env.PARSE_SERVER_CLOUD_CODE_MAIN || './cloud';
const parseServerDatabaseURI = process.env.PARSE_SERVER_DATABASE_URI || 'mongodb://heroku_2qpf9541:7q4331b1e1m4qbdg43brp5jop3@ds139879.mlab.com:39879/heroku_2qpf9541';
const parseServerFacebookAppIDS = process.env.PARSE_SERVER_FACEBOOK_APP_IDS || '';

const appName = process.env.APP_NAME || 'Saturn';

// Configure ParseServer
const parseAPI = new ParseServer({
    databaseURI: parseServerDatabaseURI,
    serverURL: parseServerURL,
    cloud: parseServerCloudCodeMain,
    appId : parseServerApplicationID,
    masterKey: parseServerMasterKey,
    auth: {
        facebook:
            {
                appIds: [parseServerFacebookAppIDS]
            }
    },
    // filesAdapter: s3FileAdapter,
    publicServerURL: parseServerURL,
    appName: appName,
    emailAdapter: {
    	module: 'parse-server-simple-mailgun-adapter',
    	options: {
    		fromAddress: 'correo@distribuidoragc.com',
    		domain: 'distribuidoragc.com',
    		apiKey: 'key-7df1233ff40d9551ce285af288234796',
    	}
    }
});

export default (app) => {
    // Serve the Parse API on the /parse URL prefix
    app.use('/parse', parseAPI);

    // Serve the Parse Dashboard on the /dashboard URL prefix
    app.use('/dashboard', parseDashboard);

    app.use(express.static('public'));

    app.set('views', './public/views');  // Specify the folder to find templates
    app.set('view engine', 'ejs');    // Set the template engine

    app.get('/', function (req, res) {
        res.status(200).send('Express is running here.');
    });
};