import jwt from "jsonwebtoken";
const admin = "admin";
const member = "member";

export const generateToken = (id: string, role: string) => {
  if (role === "admin") {
    return jwt.sign({ id, role }, admin, { expiresIn: "1d" });
  } else {
    return jwt.sign({ id, role }, member, { expiresIn: "1d" });
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, admin) as {
      id: string;
      role: string;
    };
  } catch (error: any) {
    return jwt.verify(token, member) as {
      id: string;
      role: string;
    };
  }
};
