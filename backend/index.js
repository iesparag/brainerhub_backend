const express = require("express");
const { connection } = require("./configs/db");
const cors = require("cors");
// Route
const { AuthRouter } = require("./Route/Auth_Route");
const productRoute  = require("./Route/Product_Route");
const { authentication } = require("./middleware/AuthMiddleware");

const app = express();

app.use(express.json());
app.use(cors());


app.use("/", AuthRouter);
app.use(authentication)
app.use("/product", productRoute);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(express.json({ extended: false }));

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`listening on http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log("trouble connecting to the db");
    console.log(err);
  }
});