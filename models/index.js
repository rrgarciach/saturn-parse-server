import Address from './address.model';
import Client from './client.model';
import Item from './item.model';
import Order from './order.model';
import Product from './product.model';
import Profile from './profile.model';
import Promoter from './promoter.model';

module.exports = function () {

    Parse.Object.registerSubclass('Address', Address);
    Parse.Object.registerSubclass('Client', Client);
    Parse.Object.registerSubclass('Item', Item);
    Parse.Object.registerSubclass('Order', Order);
    Parse.Object.registerSubclass('Product', Product);
    Parse.Object.registerSubclass('Profile', Profile);
    Parse.Object.registerSubclass('Promoter', Promoter);

};
