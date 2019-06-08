const express = require("express");
const router = express.Router();
const axios = require("axios");

const AWS = require('aws-sdk');

// create a new instance of the S3 service
const s3Service = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});

// require .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// set up the AWS SDK with required environment variables
AWS.config.update({
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})


// given an object's key, generate the public URL for it
function formatPublicURL(key){
  return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`
}

// removes trailing / from any URL variable keys passed to it
function formatKey(key){
  if(key.charAt(-1) === '/'){
    return key.slice(0, key.length -1);
  }
  return key;
}


// returns the URL for the home page's splash image. Make sure only one image is ever in the 'background' folder
router.get("/splash-image", (req, res, next) => {
  s3Service.listObjectsV2({Prefix: 'background/_'}, (err, data) => {
    if(err){
      res.status(500).send({ERR :err});
    }else{
      let publicURL = formatPublicURL(data.Contents[0].Key)
      res.status(200).send({URL: publicURL});
    }
  })
})

// return an array of 'collections' (S3 folders)
router.get("/collection-names", (req, res, next) => {
  s3Service.listObjectsV2((err, data) => {
    if(err){
      res.status(500).send({ERR: err});
    }else{
      // filter objects down to any object that's a folder (ends with '/') and isn't the background folder
      data.Contents = data.Contents.filter(object => object.Key.slice(-1) === '/' && object.Key !== 'background/')
      res.status(200).send(data.Contents);
    }
  })
})

// returns the description of a collection to be used in the collection preview
router.get("/collection-description/:key", (req, res, next) => {
  req.params.key = formatKey(req.params.key);
  axios.get(formatPublicURL(`${req.params.key}/desc.json`))
  .then(response => response.data)
  .then(response => res.status(200).send(response))
})


// returns a URL to the first image in a collection to be used a preview on the collections page
router.get("/collection-preview/:key", (req, res, next) => {
    req.params.key = formatKey(req.params.key);

    // retrieve all object's with the key prefix, and return the first one's URL
    s3Service.listObjectsV2({Prefix: `${req.params.key}/_`}, (err, data) => {
      if(err){
        res.status(500).send({ERR: err});
      }else{
        if(data.Contents.length === 0){
          res.status(404).send({ERR: `404: ${req.params.key} returned 0 results`})
        }else{
          // return URL to first image and the contents of the description file
          res.status(200).send({
            URL: formatPublicURL(data.Contents[0].Key)
        });
        }
      }
  })
})




module.exports = router;
