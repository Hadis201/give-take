import { Router } from "express";
import { verifyUser } from "../middleware/auth_middleware.js";
import { addMembersToGroup, createGroup, getGroupDetails, getUserGroups } from "../controller/group.controller.js";

const router = Router();
router.use(verifyUser);
router.post("/create-group", createGroup);
router.get("/get-group-details/:groupId", getGroupDetails);
router.post("/add-group-members/:groupId", addMembersToGroup);
router.get("/get-user-groups", getUserGroups);

export default router;




