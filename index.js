require("./db/config");
const express = require("express");
const cors = require("cors");
const User = require("./db/user");
const Product = require("./db/product");
const Jwt = require("jsonwebtoken");
const JwtKey = "e-comm";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, JwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({
            result: "something went wrong, please try after sometime",
          });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "no found user" });
    }
  } else {
    res.send({ result: "please enter all field" });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No Product Found" });
  }
});

app.get("/product/:_id", async (req, res) => {
  let result = await Product.findById({ _id: req.params._id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No Record Match This Product" });
  }
});

function verifyToken(req, resp, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, JwtKey, (err, vaild) => {
      if (err) {
        resp.status(401).send({ result: "Please Provide Token" });
      } else {
        next();
      }
    });
  } else {
    resp.status(403).send({ result: "Please add token with header" });
  }
}

app.listen(5000);
