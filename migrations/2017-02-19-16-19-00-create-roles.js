// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
module.exports.up = () => {
    console.info('Creating Roles...');

    let roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(true);

    let roles = [];
    roles.push( new Parse.Role('Administrator', roleACL) );
    roles.push( new Parse.Role('Promoter', roleACL) );
    roles.push( new Parse.Role('Client', roleACL) );
    roles.push( new Parse.Role('Guest', roleACL) );

    return Parse.Object.saveAll(roles, {
        success: () => {
            console.info('Roles successfully created.');
        },
        error: error => {
            console.error(error.message, error);
        },
    });

};

module.exports.down = () => {
    console.info('Rolling back Roles...');

    let roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(false);

    let roles = [];
    roles.push( new Parse.Role('Administrator', roleACL) );
    roles.push( new Parse.Role('Promoter', roleACL) );
    roles.push( new Parse.Role('Client', roleACL) );
    roles.push( new Parse.Role('Guest', roleACL) );

    return Parse.Object.saveAll(roles, {
        success: () => {
            console.info('Roles successfully removed.');
        },
        error: error => {
            console.error(error.message, error);
        },
    });
};
