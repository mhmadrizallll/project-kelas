import { Request, Response, NextFunction } from "express";
import authMiddleware from "../../middlewares/auth"; // Sesuaikan path ke middleware
import { verifyToken } from "../../utils/jwt"; // Sesuaikan path ke utils jwt

// Mock fungsi verifyToken agar tidak melakukan validasi asli
jest.mock("../../utils/jwt", () => ({
  verifyToken: jest.fn(),
}));

describe("authMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} }; // Pastikan headers selalu ada
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should return 401 if no token is provided", async () => {
    await authMiddleware(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Unauthorized",
    });
  });

  test("should return 401 if token is invalid", async () => {
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    req.headers = { authorization: "Bearer invalid_token" };

    await authMiddleware(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      message: "Invalid token",
    });
  });

  test("should call next if a valid token is provided", async () => {
    const mockUser = { id: "123", role: "admin" };
    (verifyToken as jest.Mock).mockReturnValue(mockUser);

    req.headers = { authorization: "Bearer valid_token" };

    await authMiddleware(req as Request, res as Response, next as NextFunction);

    expect(req).toHaveProperty("user", mockUser);
    expect(next).toHaveBeenCalled();
  });
});
