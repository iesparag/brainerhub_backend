const express = require("express");
const app = express.Router();
const {productModel} = require("../model/product.model")



app.get("/", async (req, res) => {
    // destructure page and limit and set default values
    const { page = 1, limit = 3, find } = req.query;
    // console.log(page, limit);
  
    try {
      if (find) {
        const products = await productModel
          .find({ name : { $regex: find, $options: "i" } })
          .limit(limit)
          .skip((page - 1) * limit)
          .exec();
         
        const count = await productModel.countDocuments();
        res.json({
          products,
          count,
          totalPages: Math.ceil(count / limit),
          
          currentPage: page,
          
        });
      } else {
        const products = await productModel
          .find()
          .limit(limit)
          .skip((page - 1) * limit)
          .exec();
        const count = await productModel.countDocuments();
        res.json({
          products,
          count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        });
      }
  
   
    } catch (err) {
      console.error(err.message);
    }
  });

  app.post("/", async (req, res) => {
    const data = req.body;
    try {
      const obj = await productModel.create(data);
      res.send({msg:"data posted"});
    } catch (e) {
      res.send({msg:e.message});
    }
  });


  app.patch("/:id", async (req, res) => {
    const data = req.body;
    const _id = req.params.id;
    try {
      const obj = await productModel.findByIdAndUpdate({ _id }, data);
      const data2 = await productModel.find()
      res.send({msg:"data updated successfully",data:data2});
    } catch (e) {
      res.send({msg:e.message});
    }
  });
  
  app.delete("/:id", async (req, res) => {
    const _id = req.params.id;
    try {
      const obj = await productModel.findByIdAndDelete({ _id });
      res.send({msg:"data delted successfully"});
    } catch (e) {
      res.send({msg:e.message});
    }
  });







  module.exports = app;