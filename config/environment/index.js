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
        FROM_ADDRESS: process.env.SMTP_ADAPTER_FROM_ADDRESS,
        EMAIL_USER: process.env.SMTP_ADAPTER_USER,
        PASSWORD: process.env.SMTP_ADAPTER_PASSWORD,
        HOST: process.env.SMTP_ADAPTER_HOST,
        IS_SSL: process.env.SMTP_ADAPTER_IS_SSL,
        PORT: process.env.SMTP_ADAPTER_PORT,
        NAME: process.env.SMTP_ADAPTER_NAME,
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
