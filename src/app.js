// Dependencies
import mongoose from "mongoose";
import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productManager from "./dao/manager/ProductManager.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

//data
//import dataProducts from './data/products.json' assert {type: 'json'};

import productModel from "./dao/models/products.model.js";

// Routes
import viewsRouter from "./routes/views.router.js";
import viewsCartsRouter from "./routes/views.cart.router.js";
import productsRouter from "./routes/products.router.js";
import realTimeProductsRouter from "./routes/realTimeProducts.router.js";
import chatRouter from "./routes/chat.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/user.router.js";
import profileRouters from "./routes/profile.router.js";
// Config

const app = express();

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./src/public"));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

// app.get('/', (req, res) => {
//     res.redirect('/products');
// })

app.use(cookieParser("9843f78efyh"));

// Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://nicodominguez1468:nicodb2023@cluster0.oyw1bco.mongodb.net/?retryWrites=true&w=majority",

      // 'mongodb://localhost:27017/ecommerce',
      mongoOptions: {
        useNewUrlParser: true,
      },
      ttl: 6000,
    }),
    secret: "9843f78efyh",
    resave: true,
    saveUninitialized: true,
  })
);
// const MongoUrl = "mongodb://localhost:27017/ecommerce"
const MongoUrl =
  "mongodb+srv://nicodominguez1468:nicodb2023@cluster0.oyw1bco.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
try {
  await mongoose.connect(MongoUrl);
} catch {
  console.error(`Database connection failed: ${error}`);
}

app.use("/", profileRouters);

// api
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//app.use(express.static('public'));

//insert product data if necessary
// try {
//     await productModel.insertMany(dataProducts);
// } catch (err) {
//     console.log(`error al insertar data: ${err} `);
// }

const httpServer = app.listen(port, () => {
  console.log(`Escuchando por el puerto ${port}`);
});
const socketServer = new Server(httpServer);

//Routers
app.use("/products", profileRouters);
app.use("/carts", viewsCartsRouter);
app.use("/realTimeProducts", realTimeProductsRouter(socketServer));
app.use("/chat", chatRouter(socketServer));
