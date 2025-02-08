import { generateToken, verifyToken } from "../../utils/jwt";

describe("jwt", () => {
  describe("generateToken", () => {
    describe("positive case", () => {
      test("generateToken for admin should return string", () => {
        const id = "id1";
        const role = "admin";
        const token = generateToken(id, role);
        expect(typeof token).toBe("string");

        // Verify if the token contains the correct role
        const decoded = verifyToken(token);
        expect(decoded.role).toBe("admin");
      });

      test("generateToken for member should return string", () => {
        const id = "id2";
        const role = "member";
        const token = generateToken(id, role);
        expect(typeof token).toBe("string");

        // Verify if the token contains the correct role
        const decoded = verifyToken(token);
        expect(decoded.role).toBe("member");
      });
    });
  });

  describe("verifyToken", () => {
    describe("positive case", () => {
      test("verifyToken should return object with correct role for admin", () => {
        const id = "id1";
        const role = "admin";
        const token = generateToken(id, role);

        const decoded = verifyToken(token);
        expect(typeof decoded).toBe("object");
        expect(decoded.role).toBe("admin");
        expect(decoded.id).toBe(id);
      });

      test("verifyToken should return object with correct role for member", () => {
        const id = "id2";
        const role = "member";
        const token = generateToken(id, role);

        const decoded = verifyToken(token);
        expect(typeof decoded).toBe("object");
        expect(decoded.role).toBe("member");
        expect(decoded.id).toBe(id);
      });
    });
  });
});
