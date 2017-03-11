module.exports.load = () => {

    Parse.Cloud.afterSave('User', (req, res) => {

        try {

            console.log('User beforeSave!!')

            let user = req.object;
            let reqUser = req.user;

            // Check if this save came from a User in order to avoid and infinite loop after saving here:
            if (req.user) {

                // Set User's ACL:
                return setUserACL(user, reqUser)

                    .then(user => {

                        return user.save(null, {useMasterKey: true});

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

function setUserACL(user, reqUser) {
    return new Promise((resolve, reject) => {

        try {

            // if (!user.existed()) {
            console.log(user)

            // let user = new Parse.Object.extend('_User');
            // user.id = _user.id;

            let userACL = new Parse.ACL();
            // Allow User to access and edit itself:
            userACL.setWriteAccess(user.id, true);
            userACL.setReadAccess(user.id, true);
            // // Allow Promoter to access and edit this user:
            // userACL.setWriteAccess(reqUser, true);
            // userACL.setReadAccess(reqUser, true);
            user.setACL(userACL);
            // }

            resolve(user);

        } catch (e) {console.error(e);}

    });

}
