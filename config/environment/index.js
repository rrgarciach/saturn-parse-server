const _ = require('lodash');

const all = {

    PARSE_SERVER: {
        APP_NAME: process.env.APP_NAME,
        APPLICATION_ID: process.env.PARSE_SERVER_APPLICATION_ID,
        MASTER_KEY: process.env.PARSE_SERVER_MASTER_KEY,
        URL: process.env.PARSE_SERVER_URL,
        CLOUD_CODE_MAIN: process.env.PARSE_SERVER_CLOUD_CODE_MAIN,
        DATABASE_URL: process.env.PARSE_SERVER_DATABASE_URI,
        FACEBOOK_APP_IDS: process.env.PARSE_SERVER_FACEBOOK_APP_IDS,
    },

    SMTP_ADAPTER: {
        FROM_ADDRESS: process.env.FROM_ADDRESS,
        EMAUL_USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        HOST: process.env.HOST,
        IS_SSL: process.env.IS_SSL,
        PORT: process.env.PORT,
        NAME: process.env.NAME,
        // EMAIL_FIELD: process.env.EMAIL_FIELD,
    },

};

let environment;

try {

    const localEnv = require('../local.env.js');
    environment = _.merge(all, localEnv);

} catch (e) {

    environment = all;

}

module.exports = environment;
