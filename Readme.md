
Install
---

    $ npm install component-hooks

Usage
---

### component.json (local component)
---

```
{
  "name": "app",
  "jade": [
    "templates/index"
  ],
  "styl": [
    "style"
  ],
  "coffee": [
    "index",
    "collections",
    "views"
  ],
  "scripts": [
    "other-script.js"
  ],
  "styles": [
    "other-style.css"
  ]
  ...
}
```

### server.js

```
var builder = require('component-hooks');
var express = require('express');

var app = express();

app.get('/', function(req, res){

  builder(__dirname)
    .dev()
    .end(function(err){
      if (err) return res.send(500, err.message);
      res.render('index');
    });

});
 
app.listen(3000);

```

Example
---

    $ make example