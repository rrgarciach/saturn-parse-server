import S3Adapter from 'parse-server-s3-adapter';

const s3AccessKey = process.env.S3_ACCESS_KEY || 'string';
const s3SecretKey = process.env.S3_SECRET_KEY || '+string/Rp6XCvhtl1f1sc4uOlVW/hhCl';
const s3Bucket = process.env.S3_BUCKET || 'saturn';
const s3Region = process.env.S3_REGION || 'us-east-1';
const s3BucketPrefix = process.env.S3_BUCKET_PREFIX || 'development/';
const s3DirectAccess = process.env.S3_DIRECT_ACCESS || false;


// Configure Files Adapter
const fileConfig = {
	region: s3Region,
	bucketPrefix: s3BucketPrefix,
	directAccess: s3DirectAccess
};

const s3FileAdapter = new S3Adapter(s3AccessKey, s3SecretKey, s3Bucket, fileConfig);

export default s3FileAdapter;
