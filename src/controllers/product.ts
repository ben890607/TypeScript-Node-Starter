import { Response, Request, NextFunction } from "express";
import "../config/passport";
import { WriteError } from "mongodb";
import { check, sanitize, validationResult } from "express-validator";

import { Product, ProductModel, ProductDocument } from "../models/Product";
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
    
    Product.find(condition, (err, result) => {
    //Product.find({$or: [{ productName: req.body.productName }, { productId: req.body.productId}]}, (err, result) => {
        if (err) { return next(err); }
        if (result) {
            res.render("product/productQuery", {
                title: "Product Query",
                products: result,
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

    Product.findOne({ productId: req.body.productId }, (err, result: ProductDocument) => {
        if (err) { return next(err); }
        if (result) {
            req.flash("errors", { msg: "Product " + result.productId + " already exists." });
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

    Product.findOne({ productId: req.params.productId }, (err, result: ProductDocument) => {
        if (err) { 
            return res.redirect("productQuery");
        }
        if (result) {           
            res.render("product/productUpdate", {
                title: "Product Update",
                product: result
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

    Product.findOne({ productId: req.body.productId }, (err, result) => {
        if (err) { return next(err); }
        if (result) {
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