const q = require('q');

import Order from '../models/order.model';
import Item from '../models/item.model';
Parse.Object.registerSubclass('Item', Item);
// require('../models/order.model');

Parse.Cloud.afterSave(Order, (request, response) => {

    let order = request.object;

    if (order.user !== undefined) {
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
                    order.save()
                        .then(() => {
                            response.success();
                        });

                }

            });
    }


});

function calcOrderTotals(order) {
    let deferred = q.defer();

    let itemsRelation = order.relation('items');
    itemsRelation.query().include('product').find()
        .then(items => {
            let totals = 0;
            order.items = items;
            order.set('subtotals', order.subtotals * 100);
            order.set('ivaTotals', order.ivaTotals * 100);
            order.set('discountTotals', order.discountTotals * 100);
            order.set('totals', order.totals);

            deferred.resolve(order);
        });

    return deferred.promise;
}
