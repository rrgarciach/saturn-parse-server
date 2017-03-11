import Client from '../models/client.model';

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

                    .then(() => {

                        res.success();

                    });

            }

        } catch (e) {
            console.error(e);
        }

    });

};

function setClientACL(client) {
    return new Promise((resolve, reject) => {

        // if (!client.existed()) {
        let clientACL = new Parse.ACL();
        // Allow Client's User to see its Client data:
        clientACL.setWriteAccess(client.user, true);
        clientACL.setReadAccess(client.user, true);
        // Allow Client's Promoter to see Client's data:
        clientACL.setWriteAccess(client.promoter.id, true);
        clientACL.setReadAccess(client.promoter.id, true);
        // Allow Operations Role to see Client's data:
        clientACL.setRoleReadAccess('Operations', true);
        clientACL.setRoleWriteAccess('Operations', true);
        client.setACL(clientACL);
        // }

        resolve(client);

    });

}
