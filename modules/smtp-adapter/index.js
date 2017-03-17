const CONFIG = require('../../config/environment');

const emailAdapter = {
    module: 'simple-parse-smtp-adapter',
    options: {
        fromAddress: CONFIG.SMTP_ADAPTER.FROM_ADDRESS,
        user: CONFIG.SMTP_ADAPTER.EMAIL_USER,
        password: CONFIG.SMTP_ADAPTER.PASSWORD,
        host: CONFIG.SMTP_ADAPTER.HOST,
        isSSL: CONFIG.SMTP_ADAPTER.IS_SSL, //True or false if you are using ssl
        port: CONFIG.SMTP_ADAPTER.PORT, //SSL port or another port
        name: CONFIG.SMTP_ADAPTER.NAME, //  optional, used for identifying to the server
        //Somtimes the user email is not in the 'email' field, the email is search first in 
        //email field, then in username field, if you have the user email in another field 
        //You can specify here 
        // emailField: CONFIG.SMTP_ADAPTER.EMAIL_FIELD,
        templates: {
            resetPassword: {
                template: './public/views/email/reset-password',
                subject: 'Restablecer su contraseña'
            },
            verifyEmail: {
                template: './public/views/email/verify-email',
                subject: 'Verificar correo electrónico'
            }
        }
        // http://stackoverflow.com/questions/37095172/parse-server-simple-mailgun-adapter-verifyuseremails-issue
    }
};

module.exports = emailAdapter;
