// import Parse from 'parse';

export default class Product extends Parse.Object {

    constructor(data) {
        super('Product');

        if (data) {
            this.id = data.id;
        }
    }

    get price() {
        return this.get('price');
    }

    set price(value) {
        this.set('price', value);
    }

}

Parse.Object.registerSubclass('Product', Product);
