export default class Client extends Parse.Object {

    constructor(data) {
        super('Client');

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

    get fullName() {
        return this.profile.fullName;
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
}

Parse.Object.registerSubclass('Client', Client);
