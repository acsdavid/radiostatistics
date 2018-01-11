var User = require('../models/user');
var Story = require('../models/story');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
  var token = jsonwebtoken.sign({
    id: user._id,
    name: user.name,
    username: user.username
  }, secretKey, {
    expiresIn: 34000
  });
 return token;
}
function createPernamentlyToken() {
  var token = jsonwebtoken.sign({
    id: 'penramently',
  }, secretKey, {
    expiresIn: 34000
  });
 return token;
}


module.exports = function (app, express) {
  var api = express.Router();

  api.post('/signup', function (req, res) {
    var user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });

    user.save(function (err) {
      if(err){
        res.send(err);
        return;
      }
      res.json({ message: 'User Has been created'});
    });
  });

  api.get('/users', function (req, res) {

    User.find({}, function (err, users) {
      if(err) {
        res.send(err);
        return;
      }

      res.json(users);
    });
  });

  api.post('/login', function (req, res) {
    User.findOne({
      username: req.body.username
    }).select('password').exec(function (err, user) {

      if(err) throw err;

      if(!user){
        res.send({
          message: 'User doesnt exist'
        });
      } else if( user ) {
        var validPassword = user.comparePassword(req.body.password);

        if(!validPassword) {
          res.send({message: 'invalid password'});
        } else {
          //token
          var token = createToken(user);
          res.json({
            success: true,
            message: "Successfully login",
            token: token
          });
        }
      }
    });
  });


  app.use(function(req, res, next) {

    console.log("Smb just came to our app!");
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    console.log("BODY");
    console.log(req.body);
    console.log("BODY-2");
    //if( req.url != "/api/signup" && req.url != "/api/login" && req.url != "/") {

      if(token){
        jsonwebtoken.verify(token, secretKey, function (err, decoded) {
          if(err){
            res.status(403).send({success: false, message: "Failed to authanticate user"});
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        /*token = createPernamentlyToken();
        jsonwebtoken.verify(token, secretKey, function (err, decoded) {
          if(err){
            res.status(403).send({success: false, message: "Failed to authanticate user"});
          } else {
            req.decoded = decoded;
            next();
          }
        });*/
        res.status(404).send({success: false, message: "No Token Provided"});
     }
   //} else {
   // next();
  //}
  });

  // Destination B
  api.route('/')
     .post(function (req, res) {
       var story = new Story({
          creator: req.decoded.id,
          content: req.body.content
        });

        story.save(function (err) {
          if(err) {
            res.send(err);
            return;
          }
          res.json({message: "New Story created"});
        })
      })
    .get(function (req, res) {
      Story.find( function (err, stories) {
        if(err) {
          res.send(err);
          return;
        }
        res.json(stories);
      })
  });

  api.get('/me', function (req,res) {
    res.json(req.decoded);
  });




  return api;
}
