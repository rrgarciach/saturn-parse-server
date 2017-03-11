import Client from '../models/client.model';

module.exports.load = () => {

    Parse.Cloud.afterSave(Client, (req, res) => {

        try {

            let client = req.object;

            // Check if this save came from a User in order to avoid and infinite loop after saving here:
            if (req.user) {

                // Set Client's ACL:
                console.log('HERE 3!!!!!');
                return setClientACL(client)

                    .then(client => {

                    //     console.log('HERE 2!!!!!');
                    //
                    //     return setUserACL(client.user);
                    //
                    // })
                    //
                    // .then(user => {
                    //
                    //     console.log('HERE!!!!!');
                    //
                    //     return user.save(null, {useMasterKey: true});
                    //
                    // })
                    //
                    // .then(_user => {
                    //
                    //     client.set('user', _user);
                    //
                    //     console.log('_user.getACL()', _user.getACL())

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

function setUserACL(_user) {
    return new Promise((resolve, reject) => {

        try {

            // if (!user.existed()) {

            let user = new Parse.Object.extend('_User');
            user.id = _user.id;

            let userACL = new Parse.ACL();
            // Allow User to access and edit itself:
            userACL.setWriteAccess(user, true);
            userACL.setReadAccess(user, true);
            // Allow Managers Role to access and edit User's data:
            userACL.setRoleReadAccess('Manager', true);
            userACL.setRoleWriteAccess('Manager', true);
            user.setACL(userACL);
            // }
            console.log('user.getACL() inner', user.getACL())

            resolve(user);

        } catch (e) {console.error(e);}

    });

}
