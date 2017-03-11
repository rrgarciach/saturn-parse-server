const clientCloud = require('./client.cloud');
const orderCloud = require('./order.cloud');
const profileCloud = require('./profile.cloud');
// const userCloud = require('./user.cloud');

clientCloud.load();
orderCloud.load();
profileCloud.load();
// userCloud.load();
