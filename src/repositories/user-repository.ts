import { UserModel } from "../../models/user-model";

class UserRepository {
  async getAllUsers(): Promise<UserModel[]> {
    return await UserModel.query();
  }

  async getUserByRole(role: string): Promise<UserModel[]> {
    return await UserModel.query().where({ role });
  }

  async getUserById(id: string): Promise<UserModel> {
    const user = await UserModel.query().findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    const user = await UserModel.query().findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async createUser(data: UserModel): Promise<UserModel> {
    return await UserModel.query().insert(data);
  }

  async updateUserById(id: string, data: UserModel): Promise<UserModel> {
    return await UserModel.query().patchAndFetchById(id, data);
  }

  async softDeleteUserById(id: string): Promise<UserModel> {
    return await UserModel.query().patchAndFetchById(id, { is_deleted: true });
  }

  async restoreUserById(id: string): Promise<UserModel> {
    return await UserModel.query().patchAndFetchById(id, { is_deleted: false });
  }
}

const userRepository = new UserRepository();
export { userRepository };
