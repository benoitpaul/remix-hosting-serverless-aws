/** @type {import('@remix-run/dev').AppConfig} */
export default process.env.NODE_ENV === "production"
  ? {
      ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
      // new
      server: "./server.ts",
      assetsBuildDirectory: "public/build",
      serverBuildPath: "server/index.js",
      publicPath: "/_static/build/",

      // appDirectory: "app",
      // assetsBuildDirectory: "public/build",
      // publicPath: "/build/",
      // serverBuildPath: "build/index.js",
    }
  : {
      ignoredRouteFiles: ["**/*.css"],
    };
