import { Router } from "express";

import {
  getInstructorLectures,
  uploadLecture,
} from "../../controllers/instructor/lecture.controller";

import { verifyUser } from "../../middlewares/auth.middleware";

import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router.get("/", verifyUser, getInstructorLectures);
router.post("/", verifyUser, upload.single("video"), uploadLecture);

export default router;
