//Import dependencies
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//wellcome
console.log("API NODE to social net ");

// Connect to DB
connection();

// Create node server
const app = express();
const port = 3500;

// Config Cors
app.use(cors());

// Convert body dates inot objects js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config Routes

const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes)



//test Route

app.get("/test", (req, res) => {
  return res.status(200).json({
    id: 1,
    name: "male",
  });
});

// Set server to listen http requests

app.listen(port, () =>{
    console.log("server running in port:", port);
})
