"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { WriteError } from "mongodb";
import log from "../util/winston";

import { UserDocument } from "../models/User";
//import * as P from "../models/Product";
import { Product, ProductDocument, ProductModel } from "../models/Product";
import { pid } from "process";

/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
export const getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token: any) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};

/**
 * GET /api/getProduct
 * List of Products.
 */
export const getProduct = (req: Request, res: Response) => {

    interface Query {
        productId?: string;
        productName?: object;
        price?: object;
    };    
    /*
    let condition: Query = {
        productId: req.query.productId as string,
        productName: req.query.productName as string,
        price: +req.query.price
    }
    */
    
    const condition: Query = {};

    if (!!req.query.productId)
        condition.productId = req.query.productId as string;  
    //尋找X開頭資料，並不分大小寫
    if (!!req.query.productName) {
        let productname = "^" + (req.query.productName);
        //condition.productName = { $regex: productname, $options: "<options>" };        
        condition.productName = { $regex: productname, $options: "i" };        
    }
    //查詢價格大於N
    if (!!req.query.price)
        //condition.price = +req.query.price;
        //condition.price = parseInt(req.query.price as string);
        condition.price = { $gte: parseInt(req.query.price as string) };    

    log.debug("query-condition", condition);
    //Product.find(condition, ["productId", "productName", "price"], (err, entity) => {    
    //Product.find( {price: {$gte: +req.query.price}}, ["productId", "productName", "price"], (err, entity) => {    
    Product.find(condition, {productId: 1, productName: 1, price: 1, _id: 0}, (err, entity) => {    
        if (err) { 
            return res.status(400).send("error:" + err);
        }
        if (entity) {
            const resModel: ProductModel[] = entity;            
            return res.send(resModel);
        }
    });    
    //}).where("price").gte(+req.query.price);    
};

export const initProduct = (req: Request, res: Response) => {
        
    /*
    const products = [{"productId":"A1", "productName": "Apple"},
                      {"productId":"B1", "productName": "Banana"},
                      {"productId":"C1", "productName": "Car"}];
    */    
    const products: any[] = [];
    let product: ProductModel = { productId: "A1", productName: "Apple", price: 100 };
    products.push(product);
    product = { productId: "A2", productName: "Air Boko", price: 10 };
    products.push(product);    
    product = { productId: "B1", productName: "Banana", price: 50 };
    products.push(product);
    product = { productId: "C1", productName: "Card", price: 200  };
    products.push(product);
    product = { productId: "D1", productName: "Desktop", price: 3000 };
    products.push(product);
    Product.insertMany(products, function (err, docs) {
        if (err){ 
            res.status(400).send("error:" + err);
        } else {
            return res.send(products);        
        }
    });   
    
    
    /*
    Product.insertMany([ { productId: "A1",  productName: "Apple"},
                         { productId: "B1",  productName: "Banana"},
                         { productId: "C1",  productName: "Car"}],
    function (err, docs) {
        if (err){ 
            res.status(400).send("error:" + err);
        } else {        
            return res.send();
        }
    });   
    */
};

export const postProduct = (req: Request, res: Response) => {

    const productModel: ProductModel = req.body;
    const product = new Product(productModel);
    /*
    const product = new Product({
        productId: productModel.productId,
        productName: productModel.productName,
        price: productModel.price
    });
    */    
        
    Product.findOne({ productId: product.productId }, (err: any, entity: ProductDocument) => {
        if (err) { 
            return res.status(400).send("error");
        }
        if (entity) {
            return res.status(400).send("Product already exists");                        
        }
        product.save((err) => {
            if (err) { return res.send(err); }
            return res.send(productModel);
        });
    });  
};

/**
 * GET /api/getProduct
 * List of Products.
 */
export const putProduct = (req: Request, res: Response) => {

    const productModel: ProductModel = req.body;
    
    Product.findOne( { productId: req.params.productId }, (err: any, entity: ProductDocument) => {    
        if (err) { 
            return res.status(400).send(err);
        }
        if (entity) {
            entity.productId = productModel.productId;
            entity.productName = productModel.productName;
            entity.price = productModel.price;
            entity.save((err: WriteError) => {
                if (err) {
                    if (err.code === 11000) {                        
                        return res.status(400).send("product already exists");
                    }
                    return res.status(400).send(err);
                }
                return res.send("product is update");
            });
        }
    });    
};