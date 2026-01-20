require("dotenv").config();
const { execSync } = require("child_process");

console.log("Deploying with credentials from .env...");

try {
  // Pass current environment variables (including those loaded by dotenv) to the child process
  execSync("npx serverless deploy", {
    stdio: "inherit",
    env: {
      ...process.env,
      AWS_DEFAULT_OUTPUT: "json",
    },
  });
} catch (error) {
  console.error("Deployment failed:", error.message);
  process.exit(1);
}
