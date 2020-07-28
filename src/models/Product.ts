import mongoose from "mongoose";

export type ProductDocument = mongoose.Document & {
    productId: string;
    productName: string;
    price: number;
};

const productSchema = new mongoose.Schema({
    productId: { type: String, unique: true },
    productName: String,
    price: Number
}, { timestamps: true });

productSchema.pre("save", function save(next) {
    const product = this as ProductDocument;
    next();
});

export const Product = mongoose.model<ProductDocument>("Product", productSchema);

export type ProductModel = {
    productId?: string;
    productName?: string;
    price?: number;
};  

export type ProductDetail = {
    productId: string; 
    color: string;
}[];