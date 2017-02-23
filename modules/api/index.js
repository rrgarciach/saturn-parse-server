import express from 'express';
import { ParseServer } from 'parse-server';
// import bodyParser from 'body-parser';

import parseDashboard from '../dashboard';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const CONFIG = require('../../config/environment');

// Configure ParseServer
const parseAPI = new ParseServer({
    databaseURI: CONFIG.PARSE_SERVER.DATABASE_URL,
    serverURL: CONFIG.PARSE_SERVER.URL,
    cloud: CONFIG.PARSE_SERVER.CLOUD_CODE_MAIN || './cloud',
    appId : CONFIG.PARSE_SERVER.APPLICATION_ID || '',
    masterKey: CONFIG.PARSE_SERVER.MASTER_KEY,
    auth: {
        facebook:
            {
                appIds: [CONFIG.PARSE_SERVER.DATABASE_URL]
            }
    },
    // filesAdapter: s3FileAdapter,
    publicServerURL: CONFIG.PARSE_SERVER.URL,
    appName: CONFIG.PARSE_SERVER.APP_NAME,
    allowClientClassCreation: false,
    sessionLength: 5 * 60 * 60,
    accountLockout: {
        duration: 5, // duration policy setting determines the number of minutes that a locked-out account remains locked out before automatically becoming unlocked. Set it to a value greater than 0 and less than 100000.
        threshold: 3, // threshold policy setting determines the number of failed sign-in attempts that will cause a user account to be locked. Set it to an integer value greater than 0 and less than 1000.
    },
    verifyUserEmails: true,
    emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds (2 hours = 7200 seconds)
    preventLoginWithUnverifiedEmail: true,
    resetTokenValidityDuration: 5 * 60 * 60, // expire after 5 hours
    emailAdapter: require('../smtp-adapter'),
    customPages: {
        invalidLink: '/views/invalid_link.html',
        passwordResetSuccess: '/views/password_reset_success.html',
        verifyEmailSuccess: '/views/verify_email_success.html',
    },

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