import Client from '../models/client.model';
import Promoter from '../models/promoter.model';

module.exports.load = () => {

    Parse.Cloud.afterSave(Client, (req, res) => {

        try {

            let client = req.object;

            // Check if this save came from a User in order to avoid and infinite loop after saving here:
            if (req.user) {

                // Set Client's ACL:
                return setClientACL(client)
                    .then(client => {

                        return client.save(null, {useMasterKey: true});

                    })
                    .then(client => {

                        return addToClientRole(client);

                    })
                    .then(() => {

                        res.success();

                    })
                    .catch(err => {
                        console.error(err);
                    });

            }

        } catch (e) {
            console.error(e);
        }

    });

};

function setClientACL(client) {
    return new Promise((resolve, reject) => {

        try {

            getPromoterData(client.promoter)
                .then(promoter => {
                    try {
                        client.promoter = promoter;
                        if (!client.existed()) {
                            let clientACL = new Parse.ACL();
                            // Allow Client's User to see its Client data:
                            clientACL.setWriteAccess(client.user, true);
                            clientACL.setReadAccess(client.user, true);
                            // Allow Client's Promoter to see Client's data:
                            clientACL.setWriteAccess(client.promoter.user.id, true);
                            clientACL.setReadAccess(client.promoter.user.id, true);
                            // Allow Operations Role to see Client's data:
                            clientACL.setRoleReadAccess('Operations', true);
                            clientACL.setRoleWriteAccess('Operations', true);
                            client.setACL(clientACL);
                        }

                        resolve(client);

                    } catch (e) {
                        console.error(e);
                    }

                });

        } catch (e) {
            console.error(e);
        }

    });
}

function getPromoterData(promoter) {
    return new Promise((resolve, reject) => {
        try {
            let query = new Parse.Query(Promoter);
            query
                .equalTo('objectId', promoter.id)
                .include('user')
                .first({useMasterKey: true})
                .then(_promoter => {
                    resolve(_promoter);
                });
        } catch (e) {
            console.error(e);
        }
    });
}

function addToClientRole(client) {
    return new Promise((resolve, reject) => {

        // Check if user is already in Client Role:
        let query = new Parse.Query(Parse.Role);
        query
            .equalTo('user', client.user)
            .count()
            .then(count => {

                // If User is not in Role, add it:
                if (count < 1) {
                    let query = new Parse.Query(Parse.Role);
                    query
                        .equalTo('name', 'Client')
                        .first({useMasterKey: true})
                        .then(role => {
                            let clientUsers = role.relation('users');
                            clientUsers.add(client.user);
                            return role.save(null, {useMasterKey: true});
                        })
                        .then(client => {
                            resolve(client);
                        });

                // If User is already in Role, then just keep moving:
                } else {
                    resolve(client);
                }

            })

    });
}
