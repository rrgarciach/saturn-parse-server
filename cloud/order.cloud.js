const _ = require('lodash');

import Order from '../models/order.model';
import Client from '../models/client.model';

module.exports.load = () => {

    Parse.Cloud.afterSave(Order, (req, res) => {

        let order = req.object;

        // Check if this save came from a User in order to avoid and infinite loop after saving here:
        if (req.user) {
            let sessionToken = req.user.get('sessionToken'); // get user session token

            // Set Order's ACL:
            return setOrderACL(order, sessionToken)

                .then(order => {

                    // Calculate Order's totals:
                    return calcOrderTotals(order, sessionToken);

                })

                .then(order => {

                    // Set ACL for Order's Items:
                    return setItemsACL(order, sessionToken);

                })

                .then(order => {

                    userHasRole(req.user, 'Operations', {sessionToken: sessionToken})
                        .then(hasRole => {

                            // Check if User has Role/privileges to change status:
                            if (!hasRole) {
                                order.unset('status');
                            }
                            return Promise.resolve();

                        })

                })

                .then(order => {

                    // Check if Order has already a folio:
                    if (!order.get('folio')) {

                        // Set Order's folio:
                        let query = new Parse.Query(Order);
                        query.descending('folio');
                        query.first({useMasterKey: true})
                            .then(_order => {
                                let maxValue = _order.get('folio') ? _order.get('folio') : 0;
                                order.set('folio', ++maxValue);
                                order.save(null, {sessionToken: sessionToken})
                                    .then(() => {
                                        res.success();
                                    });

                            });

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

function setOrderACL(order, sessionToken) {
    return new Promise((resolve, reject) => {

        let client = order.client;
        let clientQuery = new Parse.Query(Client);
        return clientQuery
            .equalTo('objectId', client.id)
            .include('promoter')
            .include('user')
            .first({sessionToken: sessionToken})
            .then(client => {
                if (!order.existed()) {
                    let orderACL = new Parse.ACL();
                    orderACL.setWriteAccess(client.user, true);
                    orderACL.setReadAccess(client.user, true);
                    orderACL.setWriteAccess(client.promoter.id, true);
                    orderACL.setReadAccess(client.promoter.id, true);
                    orderACL.setRoleReadAccess('Operations', true);
                    orderACL.setRoleWriteAccess('Operations', true);
                    order.setACL(orderACL);
                }

                order.set('client', client);
                resolve(order);
            });

    });

}

function setItemsACL(order, sessionToken) {
    return new Promise((resolve, reject) => {

        let client = order.client;
        let items = order.items;

        let itemACL = new Parse.ACL();
        itemACL.setWriteAccess(client.user, true);
        itemACL.setReadAccess(client.user, true);
        itemACL.setWriteAccess(client.promoter.id, true);
        itemACL.setReadAccess(client.promoter.id, true);
        itemACL.setRoleReadAccess('Operations', true);
        itemACL.setRoleWriteAccess('Operations', true);

        _.each(items, item => {

            if (!item.existed()) {
                item.setACL(itemACL);
            }

        });

        return Parse.Object.saveAll(items, {
            sessionToken: sessionToken,
            success: () => {
                resolve(order);
            },
            error: error => {
                console.error(error.message, error);
            },
        });

    });

}

function calcOrderTotals(order, sessionToken) {

    return new Promise((resolve, reject) => {

        let itemsRelation = order.relation('items');
        itemsRelation.query()
            .include('product')
            .find({sessionToken: sessionToken})
            .then(items => {
                order.items = items;
                order.set('subtotals', order.subtotals);
                order.set('ivaTotals', order.ivaTotals);
                order.set('discountTotals', order.discountTotals);
                order.set('totals', order.totals);
                resolve(order);
            });

    });

}

function userHasRole(user, roleName, options = {}) {
    return new Promise((resolve, reject) => {

        if (user) {

            let queries = [
                new Parse.Query('_Role').equalTo('users', user)
            ];
            // Maximum depth is 3, after that we get a "" error from Parse
            for (let i = 0; i < 2; i++) {
                queries.push(new Parse.Query('_Role').matchesQuery('roles', queries[i]));
            }

            Parse.Query.or.apply(Parse.Query, queries)
                .find(options)
                .then(roles => {
                    _.each(roles, role => {
                        if (role.get('name') === roleName) {
                            resolve(true);
                        }
                        resolve(false);

                    });
                });

        }

        resolve();

    });
}