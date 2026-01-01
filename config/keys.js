// read environment variables from .env file and export them
const {
  PORT,
  CONNECTION_URL,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
} = process.env;

module.exports = {
  port: PORT,
  connectionUrl: CONNECTION_URL,
  jwtSecret: JWT_SECRET,
  emailUser: EMAIL_USER,
  emailPass: EMAIL_PASS,
  awsAccessKey: AWS_ACCESS_KEY,
  awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
  awsBucketName: AWS_BUCKET_NAME,
  awsRegion: AWS_REGION,
};
