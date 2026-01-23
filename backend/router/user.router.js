import { getDiscoverUsers, getUserSummary, respondToFriendRequest, searchUserByname, sendFriendRequest } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/auth_middleware.js";

import { Router } from "express";
const router = Router();




router.use(verifyUser);




router.post("/send-friend-request", sendFriendRequest);
router.post("/respond-friend-request", respondToFriendRequest);
router.post("/search-users",searchUserByname);
router.get("/get-discover-users", getDiscoverUsers);
router.get("/get-user-summary", getUserSummary);
export default router;