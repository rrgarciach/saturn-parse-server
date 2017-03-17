const ordersDownloader = require('./orders-download');

module.exports = function (app) {
    ordersDownloader(app);
};
