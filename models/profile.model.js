export default class Profile extends Parse.Object {

    constructor(data) {
        super('Profile');

        if (data) {
            this.id = data.id;
            this.set('address', data.get('address'));
        }
    }

    get firstName() {
        return this.get('firstName');
    }

    set firstName(firstName) {
        this.set('firstName', firstName);
    }

    get lastName() {
        return this.get('lastName');
    }

    set lastName(lastName) {
        this.set('lastName', lastName);
    }

    get rfc() {
        return this.get('rfc');
    }

    set rfc(rfc) {
        this.set('rfc', rfc);
    }

    get address() {
        return this.get('address');
    }

    set address(address) {
        this.set('address', address);
    }

    get fullName() {
        return `${this.get('lastName')} ${this.get('firstName')}`;
    }

}

Parse.Object.registerSubclass('Profile', Profile);
