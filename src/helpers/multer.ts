import multer from "multer";

export const ExcelUploader = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(xlsx)$/)){
            return cb(new Error("Error file name"));
        };
        if(file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            return cb(new Error("Only .xlsx file is allowed"));
        }
        cb(null, true);
    },
   limits : {
       fileSize: 1024 * 1024 * 10
   }
})