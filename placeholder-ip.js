Ips = new Mongo.Collection("ips");


if (Meteor.isClient) {

  // No iron-router on client 
  Router.options.autoStart = false;

  Template.ip.helpers({
    ip: function () {
      var ip = Ips.findOne({});
      if (ip != null && ip.KEY != null) {
        var html = "Current Web Server IP Address is <a href=\"" + ip.KEY + "\">" + ip.KEY + "</a>";
        if (ip.TIME != null) {
          html += "<div>Last Updated on " + ip.TIME + "</div>";
        }
        return html;
      }
      return "Web Server is not online!";
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });

  Router.route("/set-ip", { where : 'server' }).post(function (req, res, next) {
    var data = JSON.parse(req.body.data);
    var ip = Ips.findOne({});
    if (ip == null) {
      Ips.insert({KEY: data["ip"], TIME: new Date()});
    } else {
      Ips.update(ip._id, {$set: {KEY: data["ip"], TIME: new Date()}});
    }
    res.end("");
  });

  Router.route("/get-ip", { where: 'server' }).get(function (req, res, next) {
    var ip = Ips.findOne({});
    if (ip != null) {
      res.end(JSON.stringify({"ip" : ip.KEY}));  
    } else {
      res.end("");
    }
    
  });

}

