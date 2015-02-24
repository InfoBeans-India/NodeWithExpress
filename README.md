[![Build Status](https://img.shields.io/travis/madhums/node-express-mongoose-demo.svg?style=flat)](https://github.com/InfoBeans-India/NodeWithExpress)
[![Dependencies](https://img.shields.io/david/madhums/node-express-mongoose-demo.svg?style=flat)](https://github.com/InfoBeans-India/NodeWithExpress)
[![Code climate](http://img.shields.io/codeclimate/github/madhums/node-express-mongoose-demo.svg?style=flat)](https://github.com/InfoBeans-India/NodeWithExpress)


## Introduction

This article lets you through a sample application developed using _Node.js_, Express Framework and using MongoDB as backend.

We’ll be covering an application walkthrough build with the following technologies:

*   Server Side - _Node.Js_
*   ClientSide - Jquery, HTML, CSS
*   View Parser Engine - Jade
*   Development framework - Express Framework
*   Database - MongoDB

**Express Framework**: Express is a minimal and flexible _Node.js_ web application framework that provides a robust set of features for web and mobile applications.

**Node.js**: _Node.js_ is an open source, cross-platform runtime environment for server-side and networking applications. _Node.js_ applications are written in JavaScript, and can be run within the _Node.js_ runtime on OS X, Microsoft Windows, Linux and FreeBSD.

**MongoDB**: MongoDB is an open source database that uses a document-oriented data model. MongoDB is one of several database types to arise in the mid-2000s under the NoSQL banner. Instead of using tables and rows as in relational databases, MongoDB is built on an architecture of collections and documents.

## Prerequisites

> <div class="op">Resources:</div>
> 
> <div class="op">&nbsp;</div>
> 
> <div class="op" style="color: rgb(85, 102, 85);">Installing Node Package Manager (npm):</div>
> 
> [http://nodejs.org/download/](http://nodejs.org/download/)
> 
> <div class="op" style="color: rgb(85, 102, 85);">Setting Up Visual Studio for Express Framework Template:</div>
> 
> [https://nodejstools.codeplex.com/wikipage?title=Installation](https://nodejstools.codeplex.com/wikipage?title=Installation "Installation")
> 
> <div class="op" style="color: rgb(85, 102, 85);"><span style="background-color: rgb(238, 238, 238);">MongoDb related resources - Installation, Running, DB Queries</span>:</div>
> 
> [http://docs.mongodb.org/manual/](http://docs.mongodb.org/manual/)
> 
> <div class="op" style="color: rgb(85, 102, 85);"><span style="background-color: rgb(238, 238, 238);">Jade Templating Engine</span>:</div>
> 
> [<span style="background-color: rgb(238, 238, 238);">http://jade-lang.com/tutorial/</span>](http://jade-lang.com/tutorial/)

## Using the Code

### Setting Up

1.  Install node package manager from [http://nodejs.org/download/](http://nodejs.org/download/)
2.  Install nodejstools from [https://nodejstools.codeplex.com/wikipage?title=Installation](https://nodejstools.codeplex.com/wikipage?title=Installation "Installation")
3.  Install MongoDb from [http://www.mongodb.org/downloads](http://www.mongodb.org/downloads)

**We're covering up on 3 main elements used in the application:**

1.  _Node.js_ code - Server side
2.  Jade Parser - Presentation side
3.  Database operations

### Project Structure

*   **public&gt;js&gt;**

    Contains the JavaScript logic (jquery, validators) for the corresponding views.

*   **public&gt;vendor&gt;**

    Global JavaScripts, stylesheets, fonts.

*   **server&gt;modules&gt;**

    Database managers, Utility functions for server side code. E.g.: Sending mail utility.

*   **server&gt;views&gt;**

    Contains jade views.

*   **node_modules**

    Contains libraries used in the application.

**Start MongoDb daemon/server first and then run the project.**

## Express Framework

### package.json

This is the configuration for the application. It specifies the dependencies(modules/libraries) needed for the application and will get installed if it does not exist on running the '`npm install`' command in the Package Manager Console of Visual Studio.

<pre lang="jscript" id="pre0" style="margin-top: 0px;">{
    <span class="code-string">"</span><span class="code-string">name"</span>: <span class="code-string">"</span><span class="code-string">NodeWithExpress"</span>,
    <span class="code-string">"</span><span class="code-string">version"</span>: <span class="code-string">"</span><span class="code-string">1.0.0"</span>,
    <span class="code-string">"</span><span class="code-string">description"</span>: <span class="code-string">"</span><span class="code-string">NodeWithExpress"</span>,
    <span class="code-string">"</span><span class="code-string">main"</span>: <span class="code-string">"</span><span class="code-string">app.js"</span>,
    <span class="code-string">"</span><span class="code-string">author"</span>: {
        <span class="code-string">"</span><span class="code-string">name"</span>: <span class="code-string">"</span><span class="code-string">InfoBeans.India"</span>,
        <span class="code-string">"</span><span class="code-string">email"</span>: <span class="code-string">"</span><span class="code-string">"</span>
    },
    <span class="code-string">"</span><span class="code-string">dependencies"</span>: {
        <span class="code-string">"</span><span class="code-string">emailjs"</span>: <span class="code-string">"</span><span class="code-string">^0.3.3"</span>,
        <span class="code-string">"</span><span class="code-string">express"</span>: <span class="code-string">"</span><span class="code-string">3.4.4"</span>,
        <span class="code-string">"</span><span class="code-string">jade"</span>: <span class="code-string">"</span><span class="code-string">*"</span>,
        <span class="code-string">"</span><span class="code-string">stylus"</span>: <span class="code-string">"</span><span class="code-string">*"</span>,
        <span class="code-string">"</span><span class="code-string">moment"</span>: <span class="code-string">"</span><span class="code-string">^1.7.2"</span>,
        <span class="code-string">"</span><span class="code-string">mongodb"</span>: <span class="code-string">"</span><span class="code-string">*"</span>
    }
}</pre>

### app.js

This file sets the initialisation parameters for the _node.js_ application.

<pre lang="jscript" id="pre1" style="margin-top: 0px;"><span class="code-comment">/*</span><span class="code-comment">*
 * Module dependencies.
 */</span>
<span class="code-keyword">var</span> express = require(<span class="code-string">'</span><span class="code-string">express'</span>);
<span class="code-keyword">var</span> http = require(<span class="code-string">'</span><span class="code-string">http'</span>);
<span class="code-keyword">var</span> path = require(<span class="code-string">'</span><span class="code-string">path'</span>);
<span class="code-keyword">var</span> app = express();

<span class="code-comment">//</span><span class="code-comment"> all environments
</span><span class="code-comment">//</span><span class="code-comment">app.set('port', process.env.PORT || 3000);
</span>app.set(<span class="code-string">'</span><span class="code-string">port'</span>, <span class="code-digit">3000</span>);
app.set(<span class="code-string">'</span><span class="code-string">views'</span>, path.join(__dirname, <span class="code-string">'</span><span class="code-string">/app/server/views'</span>));
app.set(<span class="code-string">'</span><span class="code-string">view engine'</span>, <span class="code-string">'</span><span class="code-string">jade'</span>);
app.locals.pretty = <span class="code-keyword">true</span>;
<span class="code-comment">//</span><span class="code-comment">app.use(express.favicon());
</span><span class="code-comment">//</span><span class="code-comment">app.use(express.logger('dev'));
</span>app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: <span class="code-string">'</span><span class="code-string">super-duper-secret-secret'</span> }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(require(<span class="code-string">'</span><span class="code-string">stylus'</span>).middleware(path.join(__dirname, <span class="code-string">'</span><span class="code-string">/app/public'</span>)));
app.use(express.<span class="code-keyword">static</span>(path.join(__dirname, <span class="code-string">'</span><span class="code-string">/app/public'</span>)));

<span class="code-comment">//</span><span class="code-comment"> development only
</span><span class="code-keyword">if</span> (<span class="code-string">'</span><span class="code-string">development'</span> == app.get(<span class="code-string">'</span><span class="code-string">env'</span>)) {
  app.use(express.errorHandler());
}

require(<span class="code-string">'</span><span class="code-string">./app/server/router'</span>)(app);

http.createServer(app).listen(app.get(<span class="code-string">'</span><span class="code-string">port'</span>), <span class="code-keyword">function</span>(){
  console.log(<span class="code-string">'</span><span class="code-string">Express server listening on port '</span> + app.get(<span class="code-string">'</span><span class="code-string">port'</span>));
});</pre>

### router.js

This file acts as a controller and responds to the request from client. It sets up the data for the view (from _services/database_) and sends the response.

<pre lang="jscript" id="pre2" style="margin-top: 0px;"><span class="code-comment">//</span><span class="code-comment">Get Function
</span>   app.get(<span class="code-string">'</span><span class="code-string">/'</span>, <span class="code-keyword">function</span> (req, res) {
        <span class="code-comment">//</span><span class="code-comment"> check if the user's credentials are saved in a cookie //
</span>        <span class="code-keyword">if</span> (req.cookies.user == undefined || req.cookies.pass == undefined) {
            res.render(<span class="code-string">'</span><span class="code-string">login'</span>, { title: <span class="code-string">'</span><span class="code-string">IB-Wall - Please Login To Your Account'</span> });
        } <span class="code-keyword">else</span> {
            <span class="code-comment">//</span><span class="code-comment"> attempt automatic login //
</span>            AM.autoLogin(req.cookies.user, req.cookies.pass, <span class="code-keyword">function</span> (o) {
                <span class="code-keyword">if</span> (o != <span class="code-keyword">null</span>) {
                    req.session.user = o;
                    res.redirect(<span class="code-string">'</span><span class="code-string">/user/'</span> + req.cookies.user);
                } <span class="code-keyword">else</span> {
                    res.render(<span class="code-string">'</span><span class="code-string">login'</span>, { title: <span class="code-string">'</span><span class="code-string">IB-Wall - Please Login To Your Account'</span> });
                }
            });
        }
    });

<span class="code-comment">//</span><span class="code-comment">Post Function
</span>    app.post(<span class="code-string">'</span><span class="code-string">/'</span>, <span class="code-keyword">function</span> (req, res) {
        AM.manualLogin(req.param(<span class="code-string">'</span><span class="code-string">user'</span>), req.param(<span class="code-string">'</span><span class="code-string">pass'</span>), <span class="code-keyword">function</span> (e, o) {
            <span class="code-keyword">if</span> (!o) {
                res.send(e, <span class="code-digit">400</span>);
            } <span class="code-keyword">else</span> {
                req.session.user = o;
                res.cookie(<span class="code-string">'</span><span class="code-string">user'</span>, o.user, { maxAge: <span class="code-digit">900000</span> });
                res.cookie(<span class="code-string">'</span><span class="code-string">pass'</span>, o.pass, { maxAge: <span class="code-digit">900000</span> });

                res.send(o, <span class="code-digit">200</span>);
                console.log(<span class="code-string">'</span><span class="code-string">user login and redirecting to home'</span>);
            }
        });
    });

    <span class="code-comment">//</span><span class="code-comment">user wall page
</span><span class="code-comment">//</span><span class="code-comment">Parameters from URL    
</span>    app.get(<span class="code-string">'</span><span class="code-string">/user/:username'</span>, <span class="code-keyword">function</span> (req, res) {

        <span class="code-keyword">if</span> (req.session.user == <span class="code-keyword">null</span>) {

            res.redirect(<span class="code-string">'</span><span class="code-string">/'</span>);

        } <span class="code-keyword">else</span> {
            <span class="code-keyword">var</span> uName = req.param(<span class="code-string">'</span><span class="code-string">username'</span>);

            AM.getAllRecords(<span class="code-keyword">function</span> (e, accounts) {
                AM.getUserByUname(uName, <span class="code-keyword">function</span> (e, onWQallOfuser) {

                    AM.getPostsForUser(onWQallOfuser, <span class="code-keyword">function</span> (e, userPosts) {
                        <span class="code-keyword">var</span> uPosts = [];
                        uPosts = userPosts;
                        res.render(<span class="code-string">'</span><span class="code-string">index'</span>, {
                            title : <span class="code-string">'</span><span class="code-string">Welcome to IB-Wall'</span>,
                            udata : req.session.user,
                            wallUserData: onWQallOfuser,
                            accounts: accounts,
                            userPosts: uPosts
                        });
                    });
                });
            });
        }
    });

<span class="code-comment">//</span><span class="code-comment">Destroy Cookies    
</span>    app.post(<span class="code-string">'</span><span class="code-string">/logoutuser'</span>, <span class="code-keyword">function</span> (req, res) {
        <span class="code-keyword">if</span> (req.param(<span class="code-string">'</span><span class="code-string">logout'</span>) == <span class="code-string">'</span><span class="code-string">true'</span>) {
            res.clearCookie(<span class="code-string">'</span><span class="code-string">user'</span>);
            res.clearCookie(<span class="code-string">'</span><span class="code-string">pass'</span>);
            req.session.destroy(<span class="code-keyword">function</span> (e) { res.send(<span class="code-string">'</span><span class="code-string">ok'</span>, <span class="code-digit">200</span>); });
        }
    });</pre>

## JADE - View Templating Engine

### index.jade

This is the View file which renders the HTML to the client.

You can convert your HTML code to jade code using many online converters available.

You can learn more about jade from online resources.

Jade follows indentation styling to group elements.

<pre lang="text" id="pre3" style="margin-top: 0px;">extends walllayout

block content
    include userdetails
    .wrapper
      .box
        .row.row-offcanvas.row-offcanvas-left
          // sidebar
          #sidebar.column.col-sm-2.col-xs-1.sidebar-offcanvas
            ul.nav
              li
                a.visible-xs.text-center(href='#', data-toggle='offcanvas')
                  i.glyphicon.glyphicon-chevron-right
            ul#lg-menu.nav.hidden-xs
                each account in accounts
                  li.active
                    a(href='http://www.codeproject.com/user/#{account.user}')
                      img.img-circle(src='http://www.codeproject.com/placehold.it/150x150', width='25px', height='25px')
                      |  #{account.name}</pre>

**Getting the data from the server variables and Setting for use in the view.**

### userdetails.jade

<div class="pre-action-link" id="premain4" style="width:100%;display:block;">[Copy Code](#)</div><pre lang="text" id="pre4" style="margin-top: 0px;">// preset form values if we receive a userdata object //

//variables are declared by using '-' sign

//Data from server can be get just by using the same variable name as declared on server end.

- user = typeof(udata) != 'undefined' ? udata : { }
- wallUser = typeof(wallUserData) != 'undefined' ? wallUserData : { }

// store the userId on the client side in a hidden input field //
input(type='hidden', value= user._id)#userId
input(type='hidden', value= wallUser._id)#wallUserId
input(type='hidden', value= user.name)#LoginUserFullName
input(type='hidden', value= wallUser.name)#wallUserFullName

// display form errors in a custom modal window //

include modals/form-errors</pre>

#### Setting a master page in other jade pages

<pre lang="cs" id="pre5" style="margin-top: 0px;">extends walllayout</pre>

#### Setting containers in master page and using in child pages

<pre lang="cs" id="pre6" style="margin-top: 0px;">block content</pre>

#### Including a jade in other jade page

<pre lang="cs" id="pre7" style="margin-top: 0px;">include userdetails</pre>

#### Below code shows how to insert script into jade pages

<pre lang="cs" id="pre8" style="margin-top: 0px;"> script(src=<span class="code-string">'</span><span class="code-string">http://www.codeproject.com/vendor/javascripts/scripts.js'</span>)</pre>

#### Below code shows how to set title and insert style into jade pages

<pre lang="cs" id="pre9" style="margin-top: 0px;">  head
    title= title
    link(rel=<span class="code-string">'</span><span class="code-string">stylesheet'</span>, href=<span class="code-string">'</span><span class="code-string">http://www.codeproject.com/vendor/stylesheets/bootstrap_wall.min.css'</span>)</pre>

##Database Operations

###AccountManager.js

**This file is responsible for the following operations:**

*   Setting up connection to mongodb database.
*   Writing functions to fetch data from database.

###Setting up connection to mongodb database

<pre lang="jscript" id="pre10" style="margin-top: 0px;"><span class="code-keyword">var</span> crypto = require(<span class="code-string">'</span><span class="code-string">crypto'</span>);
<span class="code-keyword">var</span> MongoDB = require(<span class="code-string">'</span><span class="code-string">mongodb'</span>).Db;
<span class="code-keyword">var</span> Server = require(<span class="code-string">'</span><span class="code-string">mongodb'</span>).Server;
<span class="code-keyword">var</span> moment = require(<span class="code-string">'</span><span class="code-string">moment'</span>);

<span class="code-keyword">var</span> dbPort = <span class="code-digit">27017</span>;
<span class="code-keyword">var</span> dbHost = <span class="code-string">'</span><span class="code-string">localhost'</span>;
<span class="code-comment">//</span><span class="code-comment">var dbName = 'node-login';
</span><span class="code-keyword">var</span> dbName = <span class="code-string">'</span><span class="code-string">manthandb-oaapt'</span>;

<span class="code-comment">/*</span><span class="code-comment"> establish the database connection */</span>

<span class="code-keyword">var</span> db = <span class="code-keyword">new</span> MongoDB(dbName, <span class="code-keyword">new</span> Server(dbHost, dbPort, { auto_reconnect: <span class="code-keyword">true</span> }), { w: <span class="code-digit">1</span> });
db.open(<span class="code-keyword">function</span> (e, d) {
    <span class="code-keyword">if</span> (e) {
        console.log(e);
    } <span class="code-keyword">else</span> {
        console.log(<span class="code-string">'</span><span class="code-string">connected to database :: '</span> + dbName);
    }
});
<span class="code-keyword">var</span> accounts = db.collection(<span class="code-string">'</span><span class="code-string">accounts'</span>);
<span class="code-keyword">var</span> posts = db.collection(<span class="code-string">'</span><span class="code-string">posts'</span>);
<span class="code-keyword">var</span> likes = db.collection(<span class="code-string">'</span><span class="code-string">userlikes'</span>);</pre>

###Database queries

<pre lang="jscript" id="pre11" style="margin-top: 0px;"><span class="code-comment">//</span><span class="code-comment">Insert
</span>exports.addNewPost = <span class="code-keyword">function</span> (data, callback) {
    data.createdDate = moment().format(<span class="code-string">'</span><span class="code-string">MMMM Do YYYY, h:mm:ss a'</span>);
    posts.insert(data, <span class="code-keyword">function</span> (e, postAdded) {
        <span class="code-keyword">if</span> (!e) {
            callback(<span class="code-keyword">null</span>, postAdded);
        }
    });
}

<span class="code-comment">//</span><span class="code-comment">Select 1
</span>exports.autoLogin = <span class="code-keyword">function</span> (user, pass, callback) {
    accounts.findOne({ user: user }, <span class="code-keyword">function</span> (e, o) {
        <span class="code-keyword">if</span> (o) {
            o.pass == pass ? callback(o) : callback(<span class="code-keyword">null</span>);
        } <span class="code-keyword">else</span> {
            callback(<span class="code-keyword">null</span>);
        }
    });
}

<span class="code-comment">//</span><span class="code-comment">Select Multiple
</span>exports.getAllRecords = <span class="code-keyword">function</span> (callback) {
    accounts.find().toArray(
        <span class="code-keyword">function</span> (e, res) {
        <span class="code-keyword">if</span> (e) callback(e)
        <span class="code-keyword">else</span> callback(<span class="code-keyword">null</span>, res)
    });
};

<span class="code-comment">//</span><span class="code-comment">Delete
</span>exports.deleteAccount = <span class="code-keyword">function</span> (id, callback) {
    accounts.remove({ _id: getObjectId(id) }, callback);
}
</pre>




###License

MIT
                        
