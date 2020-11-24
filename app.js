/*jshint esversion: 6 */
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
mongoose.connect('mongodb+srv://****:****@cluster0.zypde.mongodb.net/wikiDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.set("view engine", ejs);
app.use(bodyParser.urlencoded({
  extended: true
}));
// create databse schema
const {
  Schema
} = mongoose;
const wikiSchema = new Schema({
  title: String,
  content: String,
});
const Article = mongoose.model('Article', wikiSchema);
// listen
app.listen(3000, function(req, res) {
  console.log("Port 3000");
});


//app router articles
app.route("/articles")
.get(function(req, res) {
  Article.find(function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
})
.post(function(req, res) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });
  article.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("The aricle is added to the database!");
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("all articles have been deleted");
    }

  });
});

// app router for specific articles
app.route("/articles/:art").get(
  function(req,res){
    Article.find({title:req.params.art},function(err,doc){


        if(doc.length){
          res.send(doc);
        }
        else{
          res.send("No element found");
        }

    });
  }
).put(
  function(req,res){
    Article.update({title:req.params.art},{title:req.body.title,content:req.body.content},{overwrite:true},function(err,doc){
      if(err){
        res.send(err);
      }
      else{
        res.send("The article is updated");
      }
    });
  }

).
patch(
  function(req,res){
    Article.update({title:req.params.art},{$set:req.body},{overwrite:false},function(err,doc){
      if(err){
        res.send(err);
      }
      else{
        res.send("The article is patched");
      }
    });
  }
).
delete(function(req,res){
  Article.deleteOne({title:req.params.art},function(err,doc){
    if(err){
      res.send(err);
    }
    else{
      res.send("The article is deleted");
    }
  });
}

);
