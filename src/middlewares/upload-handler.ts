import multer from "multer";
import path from "path";

const public_dir = path.join(__dirname, "../public");
const upload_dir = path.join(public_dir, "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload_dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, must be jpeg, jpg or png"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});
