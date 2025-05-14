const { execSync } = require("child_process")

console.log("Analyzing bundle size...")
process.env.ANALYZE = "true"
execSync("next build", { stdio: "inherit" })
