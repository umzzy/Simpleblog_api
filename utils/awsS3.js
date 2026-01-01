const {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const {
  awsRegion,
  awsAccessKey,
  awsSecretAccessKey,
  awsBucketName,
} = require("../config/keys");
const generateCode = require("./generatecode");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey,
  },
});
const uploadFileToS3 = async ({ file, ext }) => {
  const Key = `${generateCode(12)}_${Date.now()}${ext}`;

  const params = {
    Bucket: awsBucketName,
    Body: file.buffer,
    Key: Key,
    contentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);
  try {
    await client.send(command);
    return Key;
  } catch (error) {
    next(error);
  }
};
const signedUrl = async (Key) => {
  const params = {
    Bucket: awsBucketName,
    Key,
  };
  const command = new GetObjectCommand(params);

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return url;
  } catch (err) {
    console.log(err);
  }
};
const deleteFileFromS3 = async (Key) => {
  const params = {
    Bucket: awsBucketName,
    Key,
  };
  const command = new DeleteObjectCommand(params);
  try {
    await client.send(command);
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadFileToS3, signedUrl, deleteFileFromS3 };
