import { Response, Request, NextFunction } from "express";
import * as test from "../models/TestModel";
import { UserDocument } from "../models/User";
import "../config/passport";


/**
 * GET /test
 * Test Page.
 */
export const getTestPage1 = (req: Request, res: Response) => {
    const product: test.Test = {
        productId: "P01",
        productName: "Switch"
    };
    const productDetail: test.TestDetail = [
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
    const product: test.Test = {
        productId: "P01",
        productName: "Switch"
    };
    const productDetail: test.TestDetail = [
        {   productId: "P01", color: "Black"  },
        {   productId: "P02", color: "White"  },
        {   productId: "P03", color: "Red"  }
    ];    

    res.render("test/testPage2", {
        title: "Test Page2",
        products: product,
        productDetails: productDetail
    });
};

/**
 * GET /test
 * Test Page.
 */
export const getTestPage3 = (req: Request, res: Response) => {
    
    res.render("test/testPage3", {
        title: "Test Page3"
    });
};