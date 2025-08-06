import {Router} from "express";

import { getAddressCoordinate } from "../controllers/map.controller";

const router = Router(); 

router.get("/getaddresscoordinate/:address", getAddressCoordinate); 

export default router;
