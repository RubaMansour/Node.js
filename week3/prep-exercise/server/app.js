import express from 'express';
import { register, login, getProfile, logout } from "./users.js";

const app = express();

app.use(express.json());

app.post("/register", register); 
app.post("/login", login); 
app.get("/profile", getProfile);
app.post("/logout", logout);

// Serve the front-end application from the `client` folder
app.use(express.static('client'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
