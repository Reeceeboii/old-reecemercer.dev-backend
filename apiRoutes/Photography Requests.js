const express = require("express");
const router = express.Router();

const AWS = require('aws-sdk');

const s3Service = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});

// require .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


AWS.config.update({
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})


// given an object's key, generate the public URL for it
function formatPublicURL(key){
  return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`
}

// returns the URL for the home page's splash image. Make sure only one image is ever in the 'background' folder
router.get("/splash-image", (req, res, next) => {
  s3Service.listObjectsV2({Prefix: 'background/_'}, (err, data) => {
    if(err){
      console.log(err)
    }else{
      let publicURL = formatPublicURL(data.Contents[0].Key)
      res.status(200).send({URL:publicURL});
    }
  })
})




module.exports = router;
