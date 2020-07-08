import { Response, Request, NextFunction } from "express";
import * as pd from "../models/Product";
import { UserDocument } from "../models/User";
import "../config/passport";


/**
 * GET /test
 * Test Page.
 */
export const getTestPage1 = (req: Request, res: Response) => {
    const product: pd.Product = {
        productId: "P01",
        productName: "Switch"
    };
    const productDetail: pd.ProductDetail = [
        {   productId: "P01", color: "Black"  },
        {   productId: "P02", color: "White"  },
        {   productId: "P03", color: "Red"  }
    ];

    /*
    req.flash("success", { msg: "Test Success!" });
    return res.redirect("/login");    
    */
    type UserProfile = {userName: string; userEmail: string};
    const userProfile: UserProfile = {
        userEmail: (req.user as UserDocument).email,
        userName: (req.user as UserDocument).profile.name
    };
    res.render("test/testPage1", {
        title: "Test Page1 - " + userProfile.userEmail,
        products: product, 
        productDetails: productDetail,
        currentUser: userProfile
    });
};

/**
 * GET /test
 * Test Page.
 */
export const getTestPage2 = (req: Request, res: Response) => {
    const product: pd.Product = {
        productId: "P01",
        productName: "Switch"
    };

    res.render("test/testPage2", {
        title: "Test Page2",
        products: product
    });
};