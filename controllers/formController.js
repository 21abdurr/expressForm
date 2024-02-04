import mongoose from "mongoose";
import Form from "../models/Form.js";

class formController {
  async index(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      const form = await Form.paginate(
        {
          // const form = await Form.find({
          userId: req.Jwt.id,
        },
        { limit: limit, page: page }
      );
      if (!form) {
        throw { code: 404, message: "FORMS NOT FOUND" };
      }
      return res.status(200).json({
        status: true,
        totalData: form.length,
        message: "FORM SHOW SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async store(req, res) {
    try {
      const form = await Form.create({
        userId: req.Jwt.id,
        title: "Untitled Form",
        description: null,
        public: true,
      });
      if (!form) {
        throw { code: 500, message: "FORM CREATE FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "FORM CREATE SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message || "FORM CREATE FAILED",
      });
    }
  }

  async show(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM ID REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "FORM ID INVALID" };
      }
      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.Jwt.id,
      });
      if (!form) {
        throw { code: 404, message: "FORM NOT FOUND" };
      }
      return res.status(200).json({
        status: true,
        message: "FORM SHOW SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM ID REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "FORM ID INVALID" };
      }
      const form = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.Jwt.id,
        },
        req.body,
        {
          new: true,
        }
      );

      if (!form) {
        throw { code: 404, message: "UPDATED FORM NOT FOUND" };
      }
      return res.status(200).json({
        status: true,
        message: "FORM UPDATE SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM ID REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "ID INVALID" };
      }
      const form = await Form.findOneAndDelete({
        _id: req.params.id,
        userId: req.Jwt.id,
      });

      if (!form) {
        throw { code: 404, message: "DELETE FORM FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "DELETE FORM SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new formController();
