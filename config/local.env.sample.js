const port = 9090;

module.exports = {

    PARSE_SERVER: {
        APP_NAME: 'Saturn-Parse-Server-Dev',
        APPLICATION_ID: 'your-app-id',
        MASTER_KEY: 'your-app-master-key',
        URL: 'http://localhost:' + port + '/parse',
        CLOUD_CODE_MAIN: './cloud',
        DATABASE_URL: 'mongodb://******',
        FACEBOOK_APP_IDS: '',
    },

    SMTP_ADAPTER: {
        FROM_ADDRESS: 'mail@email.com',
        USER: 'mail@demail.com',
        PASSWORD: 'password',
        HOST: 'yourhost.com',
        IS_SSL: true, //True or false if you are using ssl
        PORT: 465, //SSL port or another port
        NAME: 'your host name', //  optional, used for identifying to the server
        //Somtimes the user email is not in the 'email' field, the email is search first in
        //email field, then in username field, if you have the user email in another field
        //You can specify here
        // EMAIL_FIELD: 'username',
    },

};
