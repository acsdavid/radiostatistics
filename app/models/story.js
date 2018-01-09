var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var StoryScema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  created: { type: Date, default: Date.now }
});

// UserScema.pre('save', function (next) {
//   var user = this;
//
//   if(!user.isModified('password')) return next();
//
//   bcrypt.hash(user.password, null, null, function (err, hash) {
//     if(err) return next(err);
//
//     user.password = hash;
//     next();
//
//   });
//
// });
//
// UserScema.methods.comparePassword = function (password) {
//   var user = this;
//   return bcrypt.compareSync(password, user.password);
// }

module.exports = mongoose.model('Story', StoryScema);
