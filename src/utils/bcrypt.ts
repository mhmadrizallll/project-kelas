import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!password) {
      reject(new Error("Password tidak boleh kosong"));
      return;
    }

    if (typeof password !== "string") {
      reject(new Error("Password harus berupa string"));
      return;
    }
    bcrypt.hash(password, 10, (err, result) => {
      resolve(result);
    });
  });
};

const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      resolve(result);
    });
  });
};

export { hashPassword, comparePassword };
