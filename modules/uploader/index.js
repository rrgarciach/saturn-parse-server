const multer  = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const streamBuffers = require('stream-buffers');

import importProduct from './importProduct';

let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

export default (app) => {
    app.post('/import/product', upload.single('catalog'), function (req, res, next) {
        let products = [];
        let file = req.file;
        let count = 0;

        let stream = new streamBuffers.ReadableStreamBuffer({
            frequency: 500,       // in milliseconds.
            chunkSize: 256     // in bytes.
        });

        stream.put(file.buffer);
        stream.stop();

        let csvStream = csv
            .parse({objectMode: true, headers: true})
            .on('data', function(product){
                console.log(`Parsing ${product.sku}...`, `${++count} products parsed.`);
                importProduct.rest(product);
                // products.push(product);
            })
            .on('error', function(error){
                console.log('error', error);
            })
            .on('end', function(){
                // for (let i = 0; i < products.length; ++i) {
                //     console.log(`Importing ${products[i].sku}...`, `${i + 1} products imported.`);
                //     importProduct(products[i]);
                // }
                console.log('done');
            });

        stream.pipe(csvStream);
        return next();

    });
};
