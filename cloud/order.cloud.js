const q = require('q');

import Order from '../models/order.model';
import Client from '../models/client.model';

module.exports.load = () => {

    Parse.Cloud.afterSave(Order, (req, res) => {

        let order = req.object;

        if (req.user) {
            let sessionToken = req.user.get('sessionToken');

            // let roleQuery = new Parse.Query('_Role');
            // roleQuery
            //     .equalTo('name', 'Operations')
            //     .first()
            //     .then(_operationsRole => {
                    // console.log('_operationsRole', _operationsRole.getUsers())

                    // operationsRole = _operationsRole;
                    let client = order.client;
                    let clientQuery = new Parse.Query(Client);
                    return clientQuery
                        .equalTo('objectId', client.id)
                        .include('promoter')
                        .include('user')
                        .first()
                // })
                .then(client => {
                    // try {
                        console.log('client', client);
                        console.log('client.promoter', client.promoter);
                        console.log('client.user', client.user);

                        if (!order.existed()) {
                            let orderACL = new Parse.ACL();
                            orderACL.setWriteAccess(client.user, true);
                            orderACL.setReadAccess(client.user, true);
                            orderACL.setWriteAccess(client.promoter.id, true);
                            orderACL.setReadAccess(client.promoter.id, true);
                            orderACL.setRoleReadAccess('Operations', true);
                            orderACL.setRoleWriteAccess('Operations', true);
                            // console.log('orderACL', orderACL)
                            order.setACL(orderACL);
                        }
                        console.log('order.existed()', order.existed())
                        console.log('order.getACL()', order.getACL())
                    // } catch (e) {
                    //     console.error(e)
                    // }

                    // check if request came from a User

                    return calcOrderTotals(order);
                    // return Promise.resolve(order);

                })
                .then(order => {

                    if (!order.get('folio')) {
                    console.log('another then')

                        let query = new Parse.Query(Order);
                        query.limit(1);
                        query.descending('folio');
                        query.first()
                            .then(_order => {
                                console.log('order', _order, _order.get('folio'), _order.folio)
                                let maxValue = _order.get('folio');
                                order.set('folio', ++maxValue);
                                // order.save(null, {useMasterKey: true})
                                order.save(null, {sessionToken: sessionToken})
                                    .then(() => {
                                        res.success();
                                    });

                            });
                        // res.error('you cannot give less than one star');

                    } else {
                        order.save(null, {useMasterKey: true})
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
