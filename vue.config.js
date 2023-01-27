const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/dashboard2/" // Thay tên repository
      : "/",
});
