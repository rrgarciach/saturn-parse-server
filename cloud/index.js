const q = require('q');

import Order from '../models/order.model';
import Item from '../models/item.model';
Parse.Object.registerSubclass('Item', Item);
// require('../models/order.model');

Parse.Cloud.beforeSave('Order', (request, response) => {

    let order = request.object;

    calcOrderTotals(order)
        .then(order => {

            if (!order.get('folio')) {

                let query = new Parse.Query(Order);
                query.limit(1);
                query.descending('folio');
                query.find()
                    .then(orders => {
                        let maxValue = orders[0].get('folio');
                        order.set('folio', ++maxValue);
                        order.save()
                            .then(() => {
                                response.success();
                            });

                    });
                // response.error('you cannot give less than one star');

            } else {
                response.success();

            }

        });


});

function calcOrderTotals(order) {
    let deferred = q.defer();

    let itemsRelation = order.relation('items');
    itemsRelation.query().include('product').find()
        .then(items => {
            let totals = 0;
            // for (let i = 0; i < order.get('items'); ++i) {
            //     totals += items[i].totals;
            // }
            order.items = items;
            console.log('ITEMS', order.items.length);
            console.log('ITEMS 1', order.items[0].totals);
            console.log('TOTALS', order.subtotals, order.ivaTotals, order.discountTotals, order.totals);
            order.set('subtotals', order.subtotals * 100);
            order.set('ivaTotals', order.ivaTotals * 100);
            order.set('discountTotals', order.discountTotals * 100);
            order.set('totals', order.totals);

            deferred.resolve(order);
        });

    return deferred.promise;
}
