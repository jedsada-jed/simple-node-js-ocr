//Require module
const express = require('express');
// Express Initialize
const app = express();
const port = 8000;
app.listen(port,()=> {
console.log('listen port 8000');
})

app.get('/test', (req,res)=>{
  res.send('Hello World');
  })
  