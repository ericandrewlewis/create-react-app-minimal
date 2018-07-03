#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const program = require("commander");
const fse = require("fs-extra");

let projectName;

program
  .arguments("<project-directory>")
  .action(name => {
    projectName = name;
  })
  .allowUnknownOption()
  .parse(process.argv);

const argumentsForCreateReactApp = process.argv.splice(2);

const createReactAppProcess = spawn(
  "create-react-app",
  argumentsForCreateReactApp
);

process.stdout.write("\nRunning create-react-app...\n");

createReactAppProcess.stdout.on("data", data => {
  process.stdout.write(data);
});

createReactAppProcess.stderr.on("data", data => {
  process.stderr.write(data);
});

createReactAppProcess.on("close", code => {
  if (code !== 0) {
    return;
  }

  fse.remove(path.join(projectName, "src"))
    .then(() => {
      return fse.copy(
        path.join(__dirname, "minimalSrcContent"),
        path.join(projectName, "src")
      );
    })
    .then(() => {
      return fse.remove(path.join(projectName, "yarn.lock"));
    })
    .then(() => {
      process.stdout.write(
        "\n[cra-minimal] Replaced create-react-app boilerplate with minimal src/ files.\n[cra-minimal] Removed yarn.lock\n"
      );
    });
});