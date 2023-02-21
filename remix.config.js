const { withEsbuildOverride } = require("remix-esbuild-override");

require("dotenv").config();

if (!process.env.DISCORD_ID || !process.env.DISCORD_SECRET) {
  throw new Error("Please provide DISCORD_ID and DISCORD_SECRET in .env");
}
// rebuild
//we need to define variables for esbuild since its easier to do than with cloudflare workers env bs
withEsbuildOverride((option, { isServer, isDev }) => {
  option.define = {
    ...option.define,
    "MODE": process.argv.includes("watch") ? "'dev'" : "'prod'",
    "DISCORD_ID": `"${process.env.DISCORD_ID}"`,
    "DISCORD_SECRET": `"${process.env.DISCORD_SECRET}"`,
    "JWT_SECRET": `"${process.env.JWT_SECRET}"`,
  };
  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  server: "./server.js",
  serverBuildPath: "functions/[[path]].js",
  serverConditions: ["worker"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["browser", "module", "main"],
  serverMinify: true,
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  future: {
    unstable_tailwind: true,
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
};
