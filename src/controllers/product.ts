import { Response, Request, NextFunction } from "express";
import "../config/passport";
import { WriteError } from "mongodb";
import { check, sanitize, validationResult } from "express-validator";

import { Product, ProductModel, ProductDocument } from "../models/Product";
import { UserDocument } from "../models/User";
import { inflate } from "zlib";
import session from "express-session";

interface Condition {
	productId?: string;
	productName?: string;
}

export const getProduct = (req: Request, res: Response) => {
	const clearQuery = req.query.clearQuery;
	let condition: Condition = {};
	if (clearQuery == "True") {
		res.render("product/productQuery", {
			title: "Product",
			conditions: condition
		});
	} else {
		if (req.session.condition)	
			condition = req.session.condition;

		res.render("product/productQuery", {
			title: "Product",
			conditions: condition
		});
	}
};

function ProductQuery(condition: Condition): ProductDocument {
	Product.find(condition, (err, result) => {		
		if (err) {
			throw err;
		}
		return result;
	});
	return null;
}

export const postProductQuery = (req: Request, res: Response, next: NextFunction) => {

	const condition: Condition = {};
	if (req.body.productId !== "") condition.productId = req.body.productId;
	if (req.body.productName !== "") condition.productName = req.body.productName;

	req.session.condition = condition;


	Product.find(condition, (err, result) => {
		//Product.find({$or: [{ productName: req.body.productName }, { productId: req.body.productId}]}, (err, result) => {
		if (err) {
			return next(err);
		}
		if (result) {
			res.render("product/productQuery", {
				title: "Product Query",
				products: result,
				conditions: condition,
			});
			return next();
		}
	});
};

export const getProductAdd = (req: Request, res: Response) => {
	const product = new Product();
	res.render("product/productAdd", {
		title: "Product Add",
		product: product,
	});
};

export const postProductAdd = (req: Request, res: Response, next: NextFunction) => {
	const product = new Product({
		productId: req.body.productId,
		productName: req.body.productName,
		price: req.body.price,
	});

	Product.findOne({ productId: req.body.productId }, (err, result: ProductDocument) => {
		if (err) {
			return next(err);
		}
		if (result) {
			req.flash("errors", {
				msg: "Product " + result.productId + " already exists.",
			});
			//return res.redirect("productAdd");

			res.render("product/productAdd", {
				title: "Product Add",
				product: product,
			});
			return next();
		}
		product.save((err) => {
			if (err) {
				return next(err);
			}
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
				product: result,
			});
		}
	});
};

export const postProductUpdate = (req: Request, res: Response, next: NextFunction) => {
	
	
	//方法1: 直接以條件進行更新
	Product.update(
		{ productId: req.params.productId },
		{
			$set: {
				productId: req.body.productId,
				productName: req.body.productName,
				price: req.body.price,
			},
		},
		{ w: 1 },
		function (err) {
			if (err) {
				if (err.code === 11000) {
					req.flash("errors", { msg: "The productId is exists." });

					return res.redirect("/product/productUpdate/" + req.params.productId);
				}
				return next(err);
			}
			req.flash("success", { msg: "Product information has been updated." });
			res.redirect("/product/productUpdate/" + req.params.productId);
		}
	);	
	
	/*
	//方法2: 已查詢回來的Instance進行更新。
	Product.findOne({ productId: req.params.productId }, (err, result: ProductDocument) => {
		if (err) {
			return next(err);
		}

		result.productId = req.body.productId;
		result.productName = req.body.productName;
		result.price = req.body.price;
		result.save((err: WriteError) => {
			if (err) {
				if (err.code === 11000) {
					req.flash("errors", { msg: "The productId is exists." });

					return res.redirect("/product/productUpdate/" + req.params.productId);
				}
				return next(err);
			}
			req.flash("success", { msg: "Product information has been updated." });
			res.redirect("/product/productUpdate/" + result.productId);
		});
	});
	*/
};
