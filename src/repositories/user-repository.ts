import { UserModel } from "../../models/user-model";

class UserRepository {
  async getAllUsers(): Promise<UserModel[]> {
    return await UserModel.query().withGraphFetched("rentals.books");
  }

  async getUserByRole(role: string): Promise<UserModel[]> {
    return await UserModel.query()
      .where({ role })
      .withGraphFetched("rentals.books");
  }

  async getUserById(id: string): Promise<UserModel | undefined> {
    return await UserModel.query().findById(id);
  }

  async getUserByEmail(email: string) {
    return await UserModel.query().findOne({ email });
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
