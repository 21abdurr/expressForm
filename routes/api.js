import express from "express";
import authController from "../controllers/authController.js";
import formController from "../controllers/formController.js";
import questionController from "../controllers/questionController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
const router = express.Router();

//Auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/login", authController.login);
router.post("/refeshToken", jwtAuth(), authController.refeshToken);

// form
router.get("/forms", jwtAuth(), formController.index);
router.post("/forms", jwtAuth(), formController.store);
router.get("/forms/:id", jwtAuth(), formController.show);
router.put("/forms/:id", jwtAuth(), formController.update);
router.delete("/forms/:id", jwtAuth(), formController.destroy);

// question
router.post("/forms/:id/questions", jwtAuth(), questionController.store);

export default router;
