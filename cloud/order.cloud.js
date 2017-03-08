const q = require('q');

import Order from '../models/order.model';

module.exports.load = () => {

    Parse.Cloud.afterSave(Order, (req, res) => {

        let order = req.object;

        if (req.user) {
            calcOrderTotals(order)
                .then(order => {

                    if (!order.get('folio')) {

                        let query = new Parse.Query(Order);
                        query.limit(1);
                        query.descending('folio');
                        query.first()
                            .then(_order => {
                                console.log('order', _order, _order.get('folio'), _order.folio)
                                let maxValue = _order.get('folio');
                                order.set('folio', ++maxValue);
                                order.save()
                                    .then(() => {
                                        res.success();
                                    });

                            });
                        // res.error('you cannot give less than one star');

                    } else {
                        order.save()
                            .then(() => {
                                res.success();
                            });

                    }

                });
        }


    });

};


function calcOrderTotals(order) {
    let deferred = q.defer();

    let itemsRelation = order.relation('items');
    itemsRelation.query().include('product').find()
        .then(items => {
            order.items = items;
            order.set('subtotals', order.subtotals);
            order.set('ivaTotals', order.ivaTotals);
            order.set('discountTotals', order.discountTotals);
            order.set('totals', order.totals);
            deferred.resolve(order);
        });

    return deferred.promise;
}