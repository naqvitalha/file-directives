#!/usr/bin/env node

var fs = require('fs')
var FolderProcessor = require("../DirectiveProcessor/FolderProcessor")

var folder = new FolderProcessor();
var currentPath = process.cwd();
console.log(currentPath);
var envVars = [];
var regExVars = [];
var showAllLogs = "false";
if (process.argv.length > 2) {
    envVars = process.argv[2].split(',');
}
if (process.argv.length > 3) {
    regExVars = process.argv[3].split(',');
}
if (process.argv.length > 4) {
    showAllLogs = process.argv[4];
}
folder.processFolder(currentPath, envVars, regExVars, showAllLogs === "true");
