// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
module.exports.up = () => {
    console.info('Creating Roles...');

    let roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(true);

    let guestRole = new Parse.Role('Guest', roleACL);

    let clientRole = new Parse.Role('Client', roleACL);

    let promoterRole = new Parse.Role('Promoter', roleACL);

    let operationsRole = new Parse.Role('Operations', roleACL);

    let managerRole = new Parse.Role('Manager', roleACL);

    let adminRole = new Parse.Role('Administrator', roleACL);

    let roles = [];
    roles.push(guestRole);
    roles.push(clientRole);
    roles.push(promoterRole);
    roles.push(operationsRole);
    roles.push(managerRole);
    roles.push(adminRole);

    return Parse.Object.saveAll(roles, {
        success: results => {
            try {

                let operationsRole = results[3];
                let managerRole = results[4];

                operationsRole.getRoles().add([managerRole]);
                managerRole.getRoles().add([adminRole]);

                let rolesRelations = [];
                rolesRelations.push(operationsRole);
                rolesRelations.push(managerRole);

                return Parse.Object.saveAll(rolesRelations, {
                    useMasterKey: true,
                    success: () => {
                        console.info('Roles successfully created.');
                    },
                    error: error => {
                        console.error(error.message, error);
                    },
                });


            } catch (e) {
                console.error(e);
            }
        },
        error: error => {
            console.error(error.message, error);
        },
    });

};

module.exports.down = () => {
    console.info('Rolling back Roles...');

    // @TODO: Add rollback for this Roles migration
};
