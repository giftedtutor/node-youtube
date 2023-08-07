import CategoryModel from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// Uplaod Image
const uploadImage = asyncHandler(async (req, res) => {
    try {
        if (req?.files?.length) {
            console.log(req.files);
            let uploadedFiles = req?.files?.map((image) => {
                return { img: image.filename };
            });
            res.status(200).send({
                success: true,
                messsage: "Files Uploaded",
                data: uploadedFiles,
            });
        } else {
            console.log("Something is missing.");
            res.status(400).send({ success: false, messsage: "Send Files." });
        }
    } catch (err) {
        console.log("error", err);
        res.status(503).send({ success: false, messsage: "Server Error." });
    }
});

// // uploadVideo
const uploadVideo = asyncHandler(async (req, res) => {
    try {
        if (req?.files?.length) {
            console.log(req.files);
            let uploadedVideos = req?.files?.map((video) => {
                return { video: video.filename };
            });
            res.status(200).send({
                success: true,
                message: "Uploaded",
                data: uploadedVideos,
            });
        } else {
            console.log("Something is missing.");
            res.status(400).send({ success: false, message: "Send Files." });
        }
    } catch (err) {
        console.log("error", err);
        res.status(503).send({ success: false, message: "Server Error." });
    }
});

// post Category data

const addCategory = asyncHandler(async (req, res) => {
    const categoryData = new CategoryModel({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    });
    try {
        const sData = await categoryData.save();
        res.status(200).json({ message: "Category Added", status: "ok" });
    } catch (err) {
        res.status(500).json(err);
    }
});
// get All Categorys present in database

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const data = await CategoryModel.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get All Category data base on School (user id)

const getCategories = asyncHandler(async (req, res) => {
    const { pageNo, records, admin_id } = req.query;
    try {
        const data = await CategoryModel.find() //CategoryModel.find({ admin_id })
            .limit(records * 1)
            .skip((pageNo - 1) * records)
            .exec();

        // get total documents in the Posts collection
        const count = await CategoryModel.count();

        // return response with posts, total pages, and current page
        res.status(200).json({
            data,
            totalPages: Math.ceil(count / records),
            currentPage: pageNo,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// get All Category Dropdown data base on School (user id)

const getCategoriesDropdown = asyncHandler(async (req, res) => {
    try {
        const data = await CategoryModel.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get edit data base on id

const editCategory = asyncHandler(async (req, res) => {
    try {
        const data = await CategoryModel.find({ _id: req.query.category_id });

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update category data

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const data = await CategoryModel.findOneAndUpdate(
            { _id: req.body._id },
            req.body
        );
        res.status(200).json({ message: "Category Record Updated!", status: "ok" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete category base on id

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const data = await CategoryModel.deleteOne({ _id: req.query.category_id });
        res.status(200).json({ message: "Category Deleted Successfully!" });
    } catch (err) {
        res.status(500).json(err);
    }
});

export {
    uploadImage,
    addCategory,
    getCategories,
    editCategory,
    updateCategory,
    deleteCategory,
    getCategoriesDropdown,
    uploadVideo
};

