/** @type {import('@remix-run/dev').AppConfig} */
export default process.env.NODE_ENV === "production"
  ? {
      ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
      server: "./server.ts",
      assetsBuildDirectory: "public/build",
      serverBuildPath: "server/index.js",
      publicPath: "/_static/build/",
    }
  : {
      ignoredRouteFiles: ["**/*.css"],
    };
