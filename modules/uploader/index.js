const q = require('q');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const streamBuffers = require('stream-buffers');

import importProduct from './importProduct';

let storage = multer.memoryStorage();
let upload = multer({storage: storage});

export default function (app) {
    app.post('/import/product', upload.single('catalog'), function (req, res, next) {
        let products = [];
        let promises = [];
        let file = req.file;
        let count = 0;

        let stream = new streamBuffers.ReadableStreamBuffer({
            frequency: 300,       // in milliseconds.
            chunkSize: 128     // in bytes.
        });

        if (!file) {
            return res.status(400);
        }

        stream.put(file.buffer);
        stream.stop();

        let csvStream = csv
            .parse({objectMode: true, headers: true})
            .on('data', function (product) {
                console.log(`Parsing ${product.sku}...`, `${++count} products parsed.`);
                products.push(importProduct(product))
                // importProduct(product)
                //     .then(product => {
                //         products.push(product);
                //         ++count;
                //         if (count % 100 === 0) {
                //             let productsToSave = products;
                //             let promise = Parse.Object.saveAll(productsToSave, {
                //                 success: () => {
                //                     console.log(`Saved ${productsToSave.length} products.`);
                //                 },
                //                 error: err => {
                //                     console.error(err);
                //                 }
                //             });
                //             promises.push(promise);
                //             products = [];
                //         }
                //     });
            })
            .on('error', function (error) {
                console.log('error', error);
            })
            .on('end', function () {
                // for (let i = 0; i < products.length; ++i) {
                //     console.log(`Importing ${products[i].sku}...`, `${i + 1} products imported.`);
                //     importProduct(products[i]);
                // }
                // console.log(`Sending Save All request to Parse DB instance for ${products.length} products...`);
                // console.log('products[0]', products[0].get('price'));
                // products[0].save({

                // for (let i = 0; i <= products.length / 100; i += 100) {
                //     console.log(`Requesting for ${i} to ${i+100}`);
                //     let promise = Parse.Object.saveAll(products.slice(i, i+100), {
                //         success: () => {
                //             console.log(`Requested for ${i} to ${i+100}`);
                //             // res.status(200);
                //         },
                //         error: err => {
                //             console.error(err);
                //             // res.status(500);
                //         }
                //     });
                //     promises.push(promise);
                //
                // }

                // q.all(promises)
                q.all(promises)
                    .then(() => {
                        console.log('done');
                        // res.status(202).end();
                    });

                // res.status(202).end();
                //
                // q.all(products)
                //     .then(_products => {
                //         console.log('Starting requests...');
                //         let i = 0;
                //         do {
                //             console.log(`Requesting for ${i} to ${i + 100}...`);
                //
                //             let promise = Parse.Object.saveAll(_products.slice(i, i + 100), {
                //                 success: () => {
                //                     console.log(`Requested for ${i} to ${i + 100}`);
                //                 },
                //                 error: err => {
                //                     console.error(err);
                //                 }
                //             });
                //
                //             promises.push(promise);
                //
                //             i += 100;
                //         }
                //         while (i < products.length / 100);
                //
                //         q.all(promises)
                //             .then(() => {
                //                 console.log('done');
                //                 // res.status(202).end();
                //             });
                //     });


            });

        stream.pipe(csvStream);
        res.status(202).end();

    });
};
