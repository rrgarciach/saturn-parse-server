export default class Address extends Parse.Object {

    constructor(data) {
        super('Address');

        if (data) {
            this.id = data.id;
        }
    }

    get street() {
        return this.get('street');
    }

    set street(street) {
        this.set('street', street);
    }

    get number() {
        return this.get('number');
    }

    set number(number) {
        this.set('number', number);
    }

    get interior() {
        return this.get('interior');
    }

    set interior(interior) {
        this.set('interior', interior);
    }

    get neighborhood() {
        return this.get('neighborhood');
    }

    set neighborhood(neighborhood) {
        this.set('neighborhood', neighborhood);
    }

    get postalCode() {
        return this.get('postalCode');
    }

    set postalCode(postalCode) {
        this.set('postalCode', postalCode);
    }

    get city() {
        return this.get('city');
    }

    set city(city) {
        this.set('city', city);
    }

    get state() {
        return this.get('state');
    }

    set state(state) {
        this.set('state', state);
    }

    get phone1() {
        return this.get('phone1');
    }

    set phone1(phone1) {
        this.set('phone1', phone1);
    }

    get phone2() {
        return this.get('phone2');
    }

    set phone2(phone2) {
        this.set('phone2', phone2);
    }

}

Parse.Object.registerSubclass('Address', Address);
