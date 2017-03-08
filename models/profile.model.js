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
        return !this.isPersonaMoral ? this.get('lastName') : '';
    }

    set lastName(lastName) {
        const value = !this.isPersonaMoral ? lastName : '';
        this.set('lastName', value);
    }

    get isPersonaMoral() {
        return this.get('isPersonaMoral');
    }

    set isPersonaMoral(isPersonaMoral) {
        this.set('isPersonaMoral', isPersonaMoral);
        this.lastName = this.lastName;
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
        return `${this.lastName} ${this.firstName}`;
    }

}

Parse.Object.registerSubclass('Profile', Profile);
