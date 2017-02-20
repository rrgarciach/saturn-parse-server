import express from 'express';
import { ParseServer } from 'parse-server';
// import bodyParser from 'body-parser';

import parseDashboard from '../dashboard';

const port = process.env.PORT || 9090;
const parseServerApplicationID = process.env.PARSE_SERVER_APPLICATION_ID || 'saturn-id';
const parseServerMasterKey = process.env.PARSE_SERVER_MASTER_KEY || 'saturn-master-key';
const parseServerURL = process.env.PARSE_SERVER_URL || 'http://localhost:' + port + '/parse';
const parseServerCloudCodeMain = process.env.PARSE_SERVER_CLOUD_CODE_MAIN || './cloud';
const parseServerDatabaseURI = process.env.PARSE_SERVER_DATABASE_URI || 'mongodb://heroku_2qpf9541:7q4331b1e1m4qbdg43brp5jop3@ds139879.mlab.com:39879/heroku_2qpf9541';
const parseServerFacebookAppIDS = process.env.PARSE_SERVER_FACEBOOK_APP_IDS || '';

const appName = process.env.APP_NAME || 'Saturn-Parse-Server-Dev';

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
    verifyUserEmails: true,
    appName: appName,
    emailAdapter: {
    	module: 'parse-server-simple-mailgun-adapter',
        // module: 'parse-server-mailgun',
        // http://stackoverflow.com/questions/37095172/parse-server-simple-mailgun-adapter-verifyuseremails-issue
    	options: {
    		fromAddress: 'noreply@distribuidoragc.com',
    		domain: 'app9a8764640c73432cb668fc126ae80ea8.mailgun.org',
            recipient: 'rrgarciach@gmail.com',
            // username: 'Distribuidora GC',
    		apiKey: process.env.MAILGUN_API_KEY || 'key-a7af7309d698c60ff11a94949af04d59',
            // templates: {
            //     passwordResetEmail: {
            //         subject: 'Reset your password',
            //         pathPlainText: resolve(__dirname, 'path/to/templates/password_reset_email.txt'),
            //         pathHtml: resolve(__dirname, 'path/to/templates/password_reset_email.html'),
            //         callback: (user) => { return { firstName: user.get('firstName') }}
            //         // Now you can use {{firstName}} in your templates
            //     },
            //     verificationEmail: {
            //         subject: 'Confirm your account',
            //         pathPlainText: resolve(__dirname, 'path/to/templates/verification_email.txt'),
            //         pathHtml: resolve(__dirname, 'path/to/templates/verification_email.html'),
            //         callback: (user) => { return { firstName: user.get('firstName') }}
            //         // Now you can use {{firstName}} in your templates
            //     },
            //     customEmailAlert: {
            //         subject: 'Urgent notification!',
            //         pathPlainText: resolve(__dirname, 'path/to/templates/custom_alert.txt'),
            //         pathHtml: resolve(__dirname, 'path/to/templates/custom_alert.html'),
            //     }
            // }
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