import { Router } from "express";

import {
  getInstructorLectures,
  uploadLecture,
} from "../../controllers/instructor/lecture.controller.js";

import { verifyUser } from "../../middlewares/auth.middleware.js";

import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", verifyUser, getInstructorLectures);
router.post("/", verifyUser, upload.single("video"), uploadLecture);

export default router;
