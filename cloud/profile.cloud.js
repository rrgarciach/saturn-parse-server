import Profile from '../models/profile.model';

module.exports.load = () => {

    Parse.Cloud.beforeSave(Profile, (req, res) => {
        if (!req.object.isPersonaMoral && !req.object.lastName) {
            res.error('Last name is required');
        } else if (req.object.isPersonaMoral && req.object.lastName) {
            res.error('Last name is not allowed for Moral Person');
        } else {
            res.success();
        }
    });

};
