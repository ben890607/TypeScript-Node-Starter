// Controllers (route handlers)
import * as homeController from "../controllers/home";
import * as userController from "../controllers/user";
import * as contactController from "../controllers/contact";
import * as testController from "../controllers/test";
import * as productController from "../controllers/product";
import * as apiController from "../controllers/api";

// API keys and Passport configuration
import * as passportConfig from "./passport";

//import express from 'express';
//const router = express();
//const router = app.routes;

export function setRouter(router: any) {
//export function setRouter() {    
    /**
     * Primary router routes.
     */
    router.get("/", homeController.index);
    router.get("/login", userController.getLogin);
    router.post("/login", userController.postLogin);
    router.get("/logout", userController.logout);
    router.get("/forgot", userController.getForgot);
    router.post("/forgot", userController.postForgot);
    router.get("/reset/:token", userController.getReset);
    router.post("/reset/:token", userController.postReset);
    router.get("/signup", userController.getSignup);
    router.post("/signup", userController.postSignup);
    router.get("/contact", contactController.getContact);
    router.post("/contact", contactController.postContact);
    router.get("/account", passportConfig.isAuthenticated, userController.getAccount);
    router.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
    router.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
    router.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
    router.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);
    router.get("/test/TestPage1", passportConfig.isAuthenticated, testController.getTestPage1);
    router.get("/test/TestPage2", passportConfig.isAuthenticated, testController.getTestPage2);
    router.get("/test/TestPage3", passportConfig.isAuthenticated, testController.getTestPage3);
    router.get("/product/productQuery", passportConfig.isAuthenticated, productController.getProduct);
    router.post("/product/productQuery", passportConfig.isAuthenticated, productController.postProductQuery);
    router.get("/product/productAdd", passportConfig.isAuthenticated, productController.getProductAdd);
    router.post("/product/productAdd", passportConfig.isAuthenticated, productController.postProductAdd);
    router.get("/product/productUpdate/:productId", passportConfig.isAuthenticated, productController.getProductUpdate);
    router.post("/product/productUpdate/:productId", passportConfig.isAuthenticated, productController.postProductUpdate);
    /**
     * API examples routes.
     */
    router.get("/api", apiController.getApi);
    router.get("/api/Product", apiController.getProduct);
    router.post("/api/Product/Init", apiController.initProduct);
    router.post("/api/Product", apiController.postProduct);
    router.put("/api/Product/:productId", apiController.putProduct);

    router.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
}


