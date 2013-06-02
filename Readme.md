
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
var hooks = require('component-hooks')
  , express = require('express');

app = express();

app.get('/', hooks, function(req, res){
  res.render('index');
});
 
app.listen(3000, function(err){
  if (err) throw err
  console.log('http://dev:3000');
});

```

Example
---

    $ make example/