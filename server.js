const express=require('express');
const hbs=require('hbs'); 
const fs=require('fs');

const port=process.env.PORT ||3000;


var app=express();

hbs.registerPartials(__dirname+'/views/partials'); // it take the directory you want to use for all of your hbs partia files and we are going to be specifying.

app.set('view engine','hbs');



//============ Middleware start
// registering the middleware 
// Use :- using app use we are able to create some middleware that helps us keep track of how our server is working.Now there are times where you might not want to call.
// we could call next after we  do something  asynchrous like a read from a database but imagine somthing goes wrong .
// you can avoid calling next to never move on to the next piece of middleware.

// next :- next exists so you can tell express that when your middleware function is done and this is usefull because
// you can have as much a middleware a you like register to a single express app.
app.use((req,res,next)=>{
   
   var now=new Date().toString();
   var log=`${now}:${req.method} ${req.url}`;
   console.log(log);
   // this will create a file with name server.log which have details
   fs.appendFile('server.log',log+'\n',(err)=>{
       if(err){
           console.log('Unable to append to server.log');
       }
   });
   
    next(); // it means that your middleware  soes not come next your  handler for each request they are never going to fire.
            // so if we wil not use it and run the app in the browser then browser will not load properly it will run very slowly this is not presence of next();

});
//============ end

// // the middleware is going to stop everything after it from executing if next() is not there .
// // it can be used to stop the app if any eoor will come to us.
// app.use((req,res,next)=>{
//     res.render('maintenance.hbs');
//     //next();// so when we call the http://localhost:3000/ we will not be able to go forward if next is commented. so we have to uncomment it to execute it further.
// });

// app.use take the middleware function you want to use.in out case we are using a built in piece of middleware
// so inside of here we'll be providing  the function off of the express object we will be making our own 
// middleware in this section.

// static:- it takes the absolute path to the folder you want to serve up if we want to be  able to serve.
// __dirname :- this is the variable that gets passed into oor file by that wrapper function we explore the name it.
// here __dirname :- node-web-server (our folder name)  
// +'/public' :- accessing the public folder.  

app.use(express.static(__dirname+'/public')); // its sequence is important.it will come after the above use.

hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
});

app.get('/',(req,res)=>{
    //res.send this is going to let us respond to the request sending some data back.
    //res.send('<h1>Hello Express</h1>');
    // res.send({
    //     name:'Andrew',
    //     likes:[
    //         'Biking',
    //         'Cities'
    //     ]
    // });

    res.render('home.hbs',{
        pageTitle:'Home Page',
        welcomeMessage:'Welcome to my website',
        //currentYear:new Date().getFullYear()
    });
});


app.get('/about',(req,res)=>{
    //res.send('About Page');
    // .hbs file use to render the data like .html
    res.render('about.hbs',{
        pageTitle:'About Page',
        //currentYear:new Date().getFullYear()
    });
});

// send back json with errormessage 
app.get('/bad',(req,res)=>{
    res.send({
        errorMessage:'Unable to handle request'
    });
});


// app.listen(3000) is going to bind the application to a port on our machine .3000 :- common port for the developing locally.
//app.listen(3000);
app.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});

console.log('server is up on port 3000');


