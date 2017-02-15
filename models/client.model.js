import Parse from 'parse';

export default class Client extends Parse.Object {

    constructor(data) {
        super('Client');

        if (data) {
            this.id = data.id;
            this.set('profile', data.get('profile'));
        }
    }

    get profile() {
        return this.get('profile');
    }

    get address() {
        return this.get('profile').get('address');
    }

    get fullName() {
        return `${this.profile.get('firstName')} ${this.profile.get('lastName')}`;
    }
}

Parse.Object.registerSubclass('Client', Client);
