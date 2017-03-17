export default class Client extends Parse.Object {

    constructor(data) {
        super('Client');

        if (data) {
            this.id = data.id;
            this.set('profile', data.get('profile'));
            this.set('promoter', data.get('promoter'));
            this.set('user', data.get('user'));
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

    get email() {
        return this.get('user').get('email');
    }

    set email(email) {
        this.get('user').set('email', email);
    }

    get fullName() {
        return this.profile.fullName;
    }

    get isPersonaMoral() {
        return this.profile.isPersonaMoral;
    }

    get rfc() {
        return this.profile.rfc;
    }

    get promoter() {
        return this.get('promoter');
    }

    set promoter(promoter) {
        this.set('promoter', promoter);
    }

    get user() {
        return this.get('user');
    }

    set user(user) {
        this.set('user', user);
    }

}

Parse.Object.registerSubclass('Client', Client);
