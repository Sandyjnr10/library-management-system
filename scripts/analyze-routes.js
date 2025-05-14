const fs = require("fs")
const path = require("path")

// Analyze the app directory to identify potential code splitting opportunities
function analyzeRoutes() {
  const appDir = path.join(process.cwd(), "app")
  const routes = []

  function scanDir(dir, route = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Skip special directories
        if (!entry.name.startsWith("_") && entry.name !== "api") {
          let newRoute = route

          // Handle dynamic routes
          if (entry.name.startsWith("[") && entry.name.endsWith("]")) {
            newRoute += `/:${entry.name.slice(1, -1)}`
          } else {
            newRoute += `/${entry.name}`
          }

          scanDir(fullPath, newRoute)
        }
      } else if (entry.name === "page.tsx" || entry.name === "page.js") {
        routes.push({
          route: route || "/",
          path: fullPath,
        })
      }
    }
  }

  scanDir(appDir)

  console.log("Routes found:")
  routes.forEach((r) => console.log(`${r.route} -> ${r.path}`))
  console.log("\nConsider implementing dynamic imports for components specific to these routes.")
}

analyzeRoutes()
