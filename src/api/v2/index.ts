import express from "express";
const router = express.Router();
import { apiTokenV2 } from "src/utils";

import web from "./web";
import bot from "./bot";
import dev from "./dev";

router.use("/web", web);
if (process.env.NODE_ENV === "development") router.use("/dev", dev);
router.use("/bot", apiTokenV2, bot);
router.get("/", (req, res) => {
  res.sendStatus(200);
});
export default router;
