import { UserModel } from "../../models/user-model";
import { userRepository } from "../repositories/user-repository";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { v4 } from "uuid";
import { generateToken } from "../utils/jwt";

class UserService {
  async getAllUsers(reqRole: string, reqId: string) {
    try {
      if (reqRole === "admin") {
        const users = await userRepository.getAllUsers();
        return users.map((user) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
      } else {
        const users = await userRepository.getUserByRole("member");
        return users
          .filter((user) => user.id === reqId)
          .map(({ password, ...userWithoutPassword }) => userWithoutPassword);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async registerGuest(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    try {
      const users = await userRepository.getAllUsers();
      if (users.some((user) => user.email === data.email)) {
        throw new Error("Email already registered");
      }

      if (!data.name || !data.email || !data.password) {
        throw new Error("All fields are required");
      }

      if (data.role !== "member") {
        throw new Error("You can't register as admin");
      }

      const hashedPassword = await hashPassword(data.password);
      const payloadRegister: any = {
        id: v4(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "member",
        is_deleted: false,
      };

      // console.log(payloadRegister);
      const user = await userRepository.createUser(payloadRegister);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async registerLogging(
    reqRole: string,
    data: {
      name: string;
      email: string;
      password: string;
      role: string;
    }
  ) {
    try {
      if (reqRole === "member") {
        throw new Error(
          "You can't register as member for news user, must be admin or guest"
        );
      }
      if (!data.name || !data.email || !data.password) {
        throw new Error("All fields are required");
      }
      if (reqRole !== "admin") {
        throw new Error("You can't register as admin");
      }

      const users = await userRepository.getAllUsers();
      if (users.some((user) => user.email === data.email)) {
        throw new Error("Email already registered");
      }

      const hashedPassword = await hashPassword(data.password);
      const payloadRegister: any = {
        id: v4(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        is_deleted: false,
      };

      const user = await userRepository.createUser(payloadRegister);
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await userRepository.getUserByEmail(email);

      if (user.is_deleted) {
        throw new Error("User already deleted");
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const token = generateToken(user.id, user.role);

      const userFilter = { ...user } as {
        [key in keyof typeof user]?: (typeof user)[key];
      };
      delete userFilter.password;
      // console.log(userFilter.role);
      return { ...userFilter, token };
      //   return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updatedUser(
    reqRole: string,
    reqId: string,
    targetUserId: string,
    data: {
      name: string;
      email: string;
      password?: string;
      role: string;
    }
  ) {
    try {
      const checkUser = await userRepository.getUserById(targetUserId);
      if (!checkUser) {
        throw new Error("User not found");
      }

      if (checkUser.is_deleted) {
        throw new Error("User already deleted");
      }

      if (reqRole === "member" && checkUser.id !== reqId) {
        throw new Error("You can't update other user as member");
      }

      if (reqRole === "admin" && checkUser.role === "admin") {
        throw new Error("You can't update admin as admin");
      }

      if (data.password) {
        const hashedPassword = await hashPassword(data.password);
        data.password = hashedPassword;
      }
      const payloadUpdate: any = { ...data };
      const updatedUser = await userRepository.updateUserById(
        targetUserId,
        payloadUpdate
      );
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteUser(reqRole: string, reqId: string, targetUserId: string) {
    const targetDelete = await userRepository.getUserById(targetUserId);
    if (!targetDelete) {
      throw new Error("User not found");
    }

    if (targetDelete.is_deleted) {
      throw new Error("User already deleted");
    }

    if (reqRole === "member" && targetDelete.id !== reqId) {
      throw new Error("You can't delete other user as member");
    }

    if (reqRole === "admin" && targetDelete.role !== "member") {
      throw new Error("You can't delete admin, just only member");
    }

    await userRepository.softDeleteUserById(targetDelete.id);
    return targetDelete;
  }

  async restoreUser(reqRole: string, reqId: string, targetUserId: string) {
    const targetRestore = await userRepository.getUserById(targetUserId);
    if (!targetRestore) {
      throw new Error("User not found");
    }

    if (!targetRestore.is_deleted) {
      throw new Error("User not deleted");
    }

    if (reqRole === "member" && targetRestore.id !== reqId) {
      throw new Error("You can't restore user as member");
    }

    if (reqRole === "admin" && targetRestore.role !== "member") {
      throw new Error("You can't restore admin, just only member");
    }

    await userRepository.restoreUserById(targetRestore.id);
    return targetRestore;
  }
}

const userService = new UserService();

export { userService };
