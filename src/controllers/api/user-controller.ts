import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { userService } from "../../services/user-service";
import { AppError } from "../../helpers/error";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(
  "60480331234-qfs6mksgeq8o6j4egg6svm5n8es9aqc5.apps.googleusercontent.com"
);

interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class UserController {
  async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const reqRole = req.user?.role;
      const reqId = req.user?.id;
      // console.log(reqRole, reqId);
      const users = await userService.getAllUsers(reqRole!, reqId!);
      res
        .status(200)
        .json({ status: true, message: "Data Users", data: users });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async getUserById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      // console.log(reqRole);
      const user = await userService.getUserById(id);
      res.status(200).json({ status: true, message: "Data User", data: user });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async registerGuest(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const defaultRole = role || "member";
      const payload = await userService.registerGuest({
        name,
        email,
        password,
        role: defaultRole,
      });
      res
        .status(201)
        .json({ status: true, message: "Register successful", data: payload });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async registerLogging(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const defaultRole = role || "member";
      const reqRole = req.user?.role;
      const payload = await userService.registerLogging(reqRole!, {
        name,
        email,
        password,
        role: defaultRole,
      });
      res
        .status(200)
        .json({ status: true, message: "Register successful", data: payload });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const payload = await userService.login(email, password);
      res
        .status(200)
        .json({ status: true, message: "Login successful", data: payload });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const reqRole = req.user?.role;
      const reqId = req.user?.id;

      const { name, email, password, role } = req.body;
      const payload = await userService.updatedUser(reqRole!, reqId!, id, {
        name,
        email,
        password,
        role,
      });
      res
        .status(201)
        .json({ status: true, message: "User updated", data: payload });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const reqRole = req.user?.role;
      const reqId = req.user?.id;
      const { id } = req.params;
      const payload = await userService.deleteUser(reqRole!, reqId!, id);
      res
        .status(200)
        .json({ status: true, message: "User deleted", data: payload });
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.status : 500;
      res.status(statusCode).json({ status: false, message: error.message });
    }
  }

  async restoreUser(req: AuthenticatedRequest, res: Response) {
    try {
      const reqRole = req.user?.role;
      const reqId = req.user?.id;
      const { id } = req.params;
      const payload = await userService.restoreUser(reqRole!, reqId!, id);
      res
        .status(200)
        .json({ status: true, message: "User restored", data: payload });
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  loginAuthGoogle = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience:
          "60480331234-qfs6mksgeq8o6j4egg6svm5n8es9aqc5.apps.googleusercontent.com",
      });

      const response = ticket.getPayload();

      const payload = {
        id: response?.sub,
        role: "member",
      };
      const tokenJwt = jwt.sign(payload, "member", { expiresIn: "1d" });
      res.status(200).json({ status: true, token: tokenJwt, data: response });
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
}

const userController = new UserController();

export { userController };
