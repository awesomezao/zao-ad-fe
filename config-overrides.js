const {
  override,
  addWebpackAlias,
  overrideDevServer,
  fixBabelImports,
  injectBabelPlugin,
  useBabelRc,
  useEslintRc,
  disableEsLint,
} = require("customize-cra");
// const { addReactRefresh } = require("customize-cra-react-refresh")
const path = require("path");
const fs = require("fs");

const appPath = (target) => path.resolve(__dirname, target);

// 配置devServer,代理
const devServerConfig = () => (config) => {
  return {
    ...config,
    compress: true,
    proxy: {
      "/apis/**": {
        target: "http://localhost:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/apis": "/",
        },
      },
    },
  };
};

module.exports = {
  webpack: override(
    addWebpackAlias({
      "@": appPath("src"),
      "~": appPath("src/assets"),
    }),
    // disableEsLint(),
    // react快速刷新,hmr
    // addReactRefresh(),
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: "css",
    }),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // useEslintRc(),
    // (config) => {
    //   config.module.rules.push({
    //     test: /\.md$/,
    //     use: "raw-loader",
    //   });
    //   return config;
    // }
  ),
  devServer: overrideDevServer(devServerConfig()),
  paths: (paths, env) => {
    return paths;
  },
};
