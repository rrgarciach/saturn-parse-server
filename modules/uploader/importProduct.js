import http from 'https';

const options = {
    'method': 'POST',
    'hostname': 'saturn-parse-server-dev.herokuapp.com',
    'port': null,
    'path': '/parse/classes/Product/',
    'headers': {
        'x-parse-application-id': 'saturn-id',
        'x-parse-master-key': 'saturn-master-key',
        'content-type': 'application/json',
        'cache-control': 'no-cache',
        'postman-token': '9e4009bc-ff07-55be-1853-3e0920ee49c8'
    }
};

export function rest(product) {
    // @TODO: Search before inserting

    // console.info(`Importing product ${product.sku}...`);

    product.price *= 100;
    product.box = parseInt(product.box);
    product.master = parseInt(product.master);
    product.ean = parseInt(product.ean);
    product.price = parseInt(product.price);

    let req = http.request(options, function (res) {
        let chunks = [];

        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function () {
            console.info(`Product ${product.sku} imported.`);
            let body = Buffer.concat(chunks);
            // console.log(body.toString());
        });
    });

    req.write(JSON.stringify(product));

    req.end();
}

export default (rawProduct) => {
    let Product = Parse.Object.extend('Product');
    let product = new Product();

    product.set('price', rawProduct.price * 100);
    product.set('box', parseInt(rawProduct.box));
    product.set('master', parseInt(rawProduct.master));
    product.set('ean', parseInt(rawProduct.ean));
    product.set('price', parseInt(rawProduct.price));

    return product;
}
