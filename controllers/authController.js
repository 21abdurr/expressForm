import User from "../models/User.js";
import emailExist from "../libraries/emailExist.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

import dotenv from "dotenv";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return Jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRATION,
  });
};
const refreshAccessToken = async (payload) => {
  return Jwt.sign(payload, env.ACCESS_REFESH_TOKEN_SECRET, {
    expiresIn: env.ACCESS_REFESH_TOKEN_EXPIRATION,
  });
};

class AuthController {
  async register(req, res) {
    try {
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }
      if (req.body.password.length < 6) {
        throw { code: 400, message: "PASSWORD_MINIMUM_6_CHARACTER" };
      }

      const isEmailExist = await emailExist(req.body.email);

      if (isEmailExist) {
        throw { code: 409, message: "EMAIL_IS_EXIST" };
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });
      if (!user) {
        throw { code: 500, message: "USER_REGISTER_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "USER_REGISTER_SUCCESS",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 400, message: "USER_NOT_FOUND" };
      }

      const isValidPassword = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isValidPassword) {
        throw { code: 400, message: "INVALID_PASSWORD" };
      }
      //  accessToken

      const accessToken = await generateAccessToken({ id: user._id });
      const refeshToken = await refreshAccessToken({ id: user._id });

      return res.status(200).json({
        status: true,
        message: "USER_LOGIN_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refeshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async refeshToken(req, res) {
    try {
      if (!req.body.refeshToken) {
        throw { code: 400, message: "REFESH_TOKEN_IS_REQUIRED" };
      }
      const verify = await Jwt.verify(
        req.body.refeshToken,
        env.ACCESS_REFESH_TOKEN_SECRET
      );
      //   console.log(refeshToken);

      let payload = {
        id: verify.id,
      };
      const accessToken = await generateAccessToken(payload);
      const refeshToken = await refreshAccessToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFESH_TOKEN_SUCCESS",
        accessToken,
        refeshToken,
      });
    } catch (error) {
      const errorJwt = [
        "invalid signature",
        "jwt malformed",
        "jwt must be provided",
        "invalid token",
      ];
      if (error.message == "jwt expired") {
        error.message = "REFESH_TOKEN_EXPIRED";
      } else if (errorJwt.includes(error.message)) {
        error.message = "REFESH_TOKEN_INVALID";
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
