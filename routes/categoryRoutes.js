import express from "express";
import { upload } from "../middlewares/uploadImages.js";
import { uploadVideoMW } from "../middlewares/uploadVideo.js";
import {
    uploadImage,
    addCategory,
    getCategories,
    editCategory,
    updateCategory,
    deleteCategory,
    getCategoriesDropdown,
    uploadVideo

} from "../controllers/categoryController.js";
const router = express.Router();

// category table routes
// upload Images
router.post("/uploadImage", upload.array("files", 10), uploadImage)
router.post("/uploadVideo", uploadVideoMW.array("video", 10), uploadVideo)

router.post("/addCategory", addCategory);
router.get("/getCategories", getCategories);
router.get("/getCategoriesDropdown", getCategoriesDropdown);

router.get("/editCategory", editCategory);
router.put("/updateCategory", updateCategory);
router.delete("/deleteCategory", deleteCategory);

export default router;
