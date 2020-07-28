import { Response, Request, NextFunction } from "express";
import "../config/passport";
import { WriteError } from "mongodb";
import { check, sanitize, validationResult } from "express-validator";

import { Product } from "../models/Product";
import { UserDocument } from "../models/User";
import { inflate } from "zlib";

export const getProduct = (req: Request, res: Response) => {
    const clearQuery = req.params.clearQuery;
    if (clearQuery == "True")
    {
        const condition = new Product();

        res.render("product/productQuery", {
            title: "Product",
            conditions: condition
        });
    }
    else
    {
        res.render("product/productQuery", {
            title: "Product"
        });
    }
};

export const postProductQuery = (req: Request, res: Response, next: NextFunction) => {

    interface Query {
        productId?: string;
        productName?: string;
    };    

    const condition: Query = {};
    if (req.body.productId !== "")
        condition.productId = req.body.productId;
    if (req.body.productName !== "")
        condition.productName = req.body.productName;
    
    Product.find(condition, (err, existingProduct) => {
    //Product.find({$or: [{ productName: req.body.productName }, { productId: req.body.productId}]}, (err, existingProduct) => {
        if (err) { return next(err); }
        if (existingProduct) {
            res.render("product/productQuery", {
                title: "Product Query",
                products: existingProduct,
                conditions: condition
            });
            return next();
        }
    });
  
};

export const getProductAdd = (req: Request, res: Response) => {

    const product = new Product();
    res.render("product/productAdd", {
        title: "Product Add",
        product: product
    });
};

export const postProductAdd = (req: Request, res: Response, next: NextFunction) => {

    const product = new Product({
        productId: req.body.productId,
        productName: req.body.productName,
        price: req.body.price
    });

    Product.findOne({ productId: req.body.productId }, (err, existingProduct) => {
        if (err) { return next(err); }
        if (existingProduct) {
            req.flash("errors", { msg: "Product " + product.productId + " already exists." });
            //return res.redirect("productAdd");
            
            res.render("product/productAdd", {
                title: "Product Add",
                product: product
            });
            return next();
        }
        product.save((err) => {
            if (err) { return next(err); }
            return res.redirect("productQuery/True");
        });
    });  
};

export const getProductUpdate = (req: Request, res: Response) => {

    Product.find({ productId: req.body.ProductId }, (err, existingProduct) => {
        if (err) { 
            req.flash("errors", { msg: "Product not exists." });
        }
        if (existingProduct) {
            res.render("product/productUpdate", {
                title: "Product Update",
                products: existingProduct
            });            
        }
    });
  
};

export const postProductUpdate = (req: Request, res: Response, next: NextFunction) => {

    const product = new Product({
        productId: req.body.productId,
        productName: req.body.productName,
        price: req.body.price
    });

    Product.findOne({ productId: req.body.productId }, (err, existingProduct) => {
        if (err) { return next(err); }
        if (existingProduct) {
            req.flash("errors", { msg: "Product " + product.productId + " already exists." });
            //return res.redirect("productAdd");
            
            res.render("product/productAdd", {
                title: "Product Add",
                product: product
            });
            return next();
        }
        product.save((err) => {
            if (err) { return next(err); }
            return res.redirect("productQuery/True");
        });
    });  
};