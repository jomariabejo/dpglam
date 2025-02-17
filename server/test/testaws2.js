const AWS = require("aws-sdk");

// Configure AWS SDK
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
});

const s3 = new AWS.S3();

// Function to check S3 connection
async function checkS3Connection() {
  try {
    const data = await s3.listBuckets().promise();
    console.log("✅ Successfully connected to AWS S3!");
    console.log("Available Buckets:", data.Buckets.map((b) => b.Name));
  } catch (error) {
    console.error("❌ Error connecting to AWS S3:", error.message);
  }
}

checkS3Connection();
