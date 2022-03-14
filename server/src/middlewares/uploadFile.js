const multer = require('multer');

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
  },
});

exports.uploadFile = (imageFile) => {
  const upload = multer({
    storage,
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, () => {
      return next();
    });
  };
};

exports.uploadMultipleFile = (thumbnail, banner) => {
  const upload = multer({
    storage,
  }).fields([
    { name: thumbnail, maxCount: 1 },
    { name: banner, maxCount: 1 },
  ]);

  return (req, res, next) => {
    upload(req, res, () => {
      return next();
    });
  };
};
