const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const CONFIG = require('../config/environment');

module.exports.up = () => {
    console.info('Creating Models...');
    try {

        MongoClient.connect(CONFIG.PARSE_SERVER.DATABASE_URL, (err, db) => {
            assert.equal(null, err);

            insertModelDocuments(db, () => {
                db.close();
            });
        });

    } catch (err) {
        console.error(err);
    }

};

module.exports.down = () => {
    console.info('Rolling Models Creation...');
    try {

        MongoClient.connect(CONFIG.PARSE_SERVER.DATABASE_URL, (err, db) => {
            assert.equal(null, err);

            removeModelDocuments(db, () => {
                db.close();
            });
        });

    } catch (err) {
        console.error(err);
    }

};

function insertModelDocuments(db, callback) {
    db.collection('_SCHEMA').insertMany([
            {
                "_id": "_User",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "username": "string",
                "email": "string",
                "emailVerified": "boolean",
                "authData": "object",
                "profile": "*Profile"
            },
            {
                "_id": "_Session",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "restricted": "boolean",
                "user": "*_User",
                "installationId": "string",
                "sessionToken": "string",
                "expiresAt": "date",
                "createdWith": "object"
            },
            {
                "_id": "Product",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "sku": "string",
                "code": "string",
                "description": "string",
                "box": "number",
                "master": "number",
                "unit": "string",
                "ean": "number",
                "price": "number",
                "brand": "string",
                "noIVA": "boolean",
                "eanBox": "number",
                "eanMaster": "number"
            },
            {
                "_id": "Profile",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "firstName": "string",
                "lastName": "string",
                "address": "*Address",
                "rfc": "string",
                "isPersonaMoral": "boolean"
            },
            {
                "_id": "Client",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "profile": "*Profile",
                "folio": "string",
                "promoter": "*Promoter",
                "user": "*_User"
            },
            {
                "_id": "Item",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "product": "*Product",
                "price": "number",
                "quantity": "number",
                "discount": "number",
                "sku": "string"
            },
            {
                "_id": "Order",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "notes": "string",
                "totals": "number",
                "ivaTotals": "number",
                "subtotals": "number",
                "client": "*Client",
                "items": "relation<Item>",
                "folio": "number",
                "discountTotals": "number",
                "status": "number"
            },
            {
                "_id": "_Role",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "name": "string",
                "users": "relation<_User>",
                "roles": "relation<_Role>"
            },
            {
                "_id": "Migration",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "script": "string"
            },
            {
                "_id": "Promoter",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "profile": "*Profile",
                "user": "*_User"
            },
            {
                "_id": "Address",
                "objectId": "string",
                "updatedAt": "date",
                "createdAt": "date",
                "street": "string",
                "neighborhood": "string",
                "city": "string",
                "state": "string",
                "interior": "string",
                "postalCode": "number",
                "number": "number",
                "phone1": "string",
                "phone2": "string"
            }
        ],
        (err, result) => {
            assert.equal(err, null);
            console.info('Models successfully created.');
            callback();
        });
}

function removeModelDocuments(db, callback) {
    db.collection('_SCHEMA').deleteMany([
            {'_id': '_User'},
            {'_id': '_Session'},
            {'_id': 'Profile'},
            {'_id': 'Client'},
            {'_id': 'Item'},
            {'_id': 'Order'},
            {'_id': '_Role'},
            {'_id': 'Migration'},
            {'_id': 'Promoter'},
            {'_id': 'Address'},
        ],
        (err, results) => {
            console.info('Models created creation rolled back.');
            callback();
        }
    );
}
