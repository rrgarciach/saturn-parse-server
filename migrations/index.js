const Migration = Parse.Object.extend('Migration');

let normalizedPath = require('path').join(__dirname, '/');

let migrations = [];
let migrationsNames = [];
let migrationsUp = [];

require('fs').readdirSync(normalizedPath).forEach(file => {
    migrations.push( require('./' + file) );
    migrationsNames.push(file);
});

function run(scripts, index) {
    let i = index === undefined ? 0 : index;

    if (!scripts[i] || migrationsNames[i] === 'index.js') {
        console.info(`Migrations are up to date.`);
        return;
    }
    if (migrationsUp.indexOf(migrationsNames[i]) > -1) {
        run(scripts, ++i);

    } else {
        console.log(`Running migration script ${migrationsNames[i]}`);
        scripts[i].up()
            .then(() => {
                let migration = new Migration();
                migration.set('script', migrationsNames[i]);
                migration.save(null, {useMasterKey: true})
                    .then(() => {
                        run(scripts, ++i);
                    });
            });
    }

}

module.exports = function () {
    let query = new Parse.Query('Migration');
    query.find({useMasterKey: true})
        .then(_migrations => {
            migrationsUp = _migrations.map(item => {
                return item.get('script');
            });
            run(migrations);
        });
};
