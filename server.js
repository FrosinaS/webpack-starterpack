// simple local server that will reload after every change in the code is made

let webpack = require("webpack");
let browersync = require("browser-sync");
let webpackConfig = require('./webpack.config');

webpack(webpackConfig, function (error, stats) {
    if (!!server && !!server.active) {
        server.reload()
    }
});

server = browersync({
    server: "./public",
    port: 8080
});