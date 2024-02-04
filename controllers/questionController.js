import mongoose from "mongoose";
import Form from "../models/Form.js";

class questionsController {
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM ID REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "FORM ID INVALID" };
      }

      const newQuestion = {
        id: new mongoose.Types.ObjectId(),
        question: null,
        type: "text",
        required: false,
        option: [],
      };

      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.Jwt.id },
        { $push: { questions: newQuestion } },
        { new: true }
      );

      if (!form) {
        throw { code: 404, message: "FORM UPDATE FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "QUESTION ADDED SUCCESS",
        question: newQuestion,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new questionsController();
