require("dotenv").config();
const { execSync } = require("child_process");

console.log("Removing stack...");

try {
  execSync("npx serverless remove", {
    stdio: "inherit",
    env: {
      ...process.env,
      AWS_DEFAULT_OUTPUT: "json",
    },
  });
} catch (error) {
  console.error("Removal failed:", error.message);
  process.exit(1);
}
