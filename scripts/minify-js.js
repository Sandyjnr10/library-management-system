const fs = require("fs")
const path = require("path")
const { minify } = require("terser")
const glob = require("glob")

async function minifyJsFiles() {
  console.log("Minifying JavaScript files...")

  // Find all JS files in the .next directory
  const files = glob.sync(".next/**/*.js")

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8")
      const result = await minify(content, {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: true,
      })

      if (result.code) {
        fs.writeFileSync(file, result.code)
        console.log(`Minified: ${file}`)
      }
    } catch (err) {
      console.error(`Error minifying ${file}:`, err)
    }
  }

  console.log("JavaScript minification complete!")
}

minifyJsFiles()
