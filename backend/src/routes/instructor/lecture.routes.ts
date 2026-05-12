import { Router } from "express";

import { uploadLecture } from "@/controllers/instructor/lecture.controller";

import { verifyUser } from "@/middlewares/auth.middleware";

import { upload } from "@/middlewares/upload.middleware";

const router = Router();

router.post("/", verifyUser, upload.single("video"), uploadLecture);

export default router;
