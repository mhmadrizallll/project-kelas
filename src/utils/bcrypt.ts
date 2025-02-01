import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, result) => {
      if (!!err) {
        reject(err);
        return;
      }
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
      if (!!err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export { hashPassword, comparePassword };
