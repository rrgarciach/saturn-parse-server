import Order from '../models/order.model';
import Client from '../models/client.model';

module.exports.load = () => {

    Parse.Cloud.afterSave(Order, (req, res) => {

        let order = req.object;

        // Check if this save came from a User in order to avoid and infinite loop after saving here:
        if (req.user) {
            let sessionToken = req.user.get('sessionToken'); // get user session token

            // Set Order's ACL:
            return setOrderACL(order)

                .then(order => {

                    // Calculate Order's totals:
                    return calcOrderTotals(order);

                })

                .then(order => {

                    // Check if Order has already a folio:
                    if (!order.get('folio')) {

                        // Set Order's folio:
                        let query = new Parse.Query(Order);
                        query.limit(1);
                        query.descending('folio');
                        query.first()
                            .then(_order => {
                                let maxValue = _order.get('folio');
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

function setOrderACL(order) {
    return new Promise((resolve, reject) => {

        let client = order.client;
        let clientQuery = new Parse.Query(Client);
        return clientQuery
            .equalTo('objectId', client.id)
            .include('promoter')
            .include('user')
            .first()
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

                resolve(order);
            });

    });

}

function calcOrderTotals(order) {

    return new Promise((resolve, reject) => {

        let itemsRelation = order.relation('items');
        itemsRelation.query().include('product').find()
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
