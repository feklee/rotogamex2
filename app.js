// Serves the game and assets.

/*jslint node: true, maxlen: 80 */

"use strict";

var express = require("express");
var app = express();
var httpServer = require("http").createServer(app);
var routes = require("./routes/create")(app.get("env"));

var startHttpServer = function () {
    httpServer.listen(app.get("port"), function () {
        console.log("Express server listening on port %d in %s mode",
                app.get("port"), app.settings.env);
    });
};

app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.use(express.compress());
app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + "/public"));

app.get("/", routes.index);
app.get("/install-webapp", routes.installWebapp);
app.get("/manifest.webapp", routes.manifestWebapp);

if (app.get("env") === "development") {
    app.use("/app", express.static(__dirname + "/app"));
    app.use(express.errorHandler());
    startHttpServer();
} else { // production
    app.use("/app.build", express.static(__dirname + "/app.build"));
    require("./app/server/optimize")(startHttpServer);
}
