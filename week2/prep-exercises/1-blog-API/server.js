const express = require('express')
const app = express();
const fs = require("fs");
app.use(express.json());


app.post('/blogs', (req, res) => {
    // How to get the title and content from the request??
    const { title, content }=req.body;
    if (!title || !content) {
      return res.status(400).send('Title and content are required!');
    }
    else
    fs.writeFileSync(title, content);
    res.end('ok')
})

app.put('/posts/:title', (req, res) => {
  // How to get the title and content from the request??
  const title = req.params.title;
  const { content }=req.body;
  if (!content) {
    return res.status(400).send('Title and content are required!');
  }
  if (!fs.existsSync(title)) {
    return res.status(404).send('This post does not exist!');
  }

  fs.writeFileSync(title, content);
  res.end('ok')
}) 

app.get('/blogs/:title', (req, res) => {
  const title = req.params.title;
  
  if (!fs.existsSync(title)) {
    return res.status(404).send('This post does not exist!');
    }
  
    const post = fs.readFileSync(title, 'utf8');
    res.status(200).send(post);
  });
   

 app.delete('/blogs/:title', (req, res) => {
  // How to get the title and content from the request??
  const title = req.params.title;
  if (fs.existsSync(title)) { // Add condition here
    fs.unlinkSync(title);
    res.end('ok');
  } else {
    res.status(404).send('This post does not exist!');
  }
 
})
 
app.get('/blogs', (req, res) => {
  const files = fs.readdirSync('./'); 
  const posts = files.map(file => ({ title: file }));
  res.status(200).json(posts);
});
// YOUR CODE GOES IN HERE
 app.get('/', function (req, res) {
  res.send('Hello World')
}) 
app.listen(3000)