export default class Promoter extends Parse.Object {

    constructor(data) {
        super('Promoter');

        if (data) {
            this.id = data.id;
            this.set('profile', data.get('profile'));
        }
    }

    get folio() {
        return this.get('folio');
    }

    set folio(folio) {
        this.set('folio', folio);
    }

    get profile() {
        return this.get('profile');
    }

    set profile(profile) {
        this.set('profile', profile);
    }

    get user() {
        return this.get('user');
    }

    set user(user) {
        this.set('user', user);
    }

    get fullName() {
        return this.profile.fullName;
    }

    get rfc() {
        return this.profile.rfc;
    }
}

Parse.Object.registerSubclass('Promoter', Promoter);
