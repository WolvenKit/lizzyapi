import express from "express";
import { apiTokenV2 } from "src/utils";
const router = express.Router();
import v1 from "./v1";
import v2 from "./v2";

router.use("/v1", v1);
router.use("/v2", v2);
// Default to v2
router.use("/", v2);

export default router;
