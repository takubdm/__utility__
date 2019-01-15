const path = require('path');
const glob = require('glob');
const fs = require('fs');
const fse = require('fs-extra');
const cheerio = require('cheerio');
const rimraf = require("rimraf");
const readline = require("readline");
const coverageDir = path.resolve(__dirname, "../../coverage");
const dirToCompare = path.resolve(__dirname, "coverage");
const htmlReportDirPath = "./lcov-report";
const jsonReportFilePath = "./coverage-final.json";

const preprocess = function(coverageDir, dirToCompare) {
  if (!fs.existsSync(coverageDir)) {
    console.log(`${coverageDir} does not exist. Process aborted.`);
    process.exit(1);
  }
  if (!fs.existsSync(dirToCompare)) {
    fs.mkdirSync(dirToCompare, { recursive: true });
  }
}

const askUpdate = function(coverageDir, dirToCompare) {
  const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
    prompt: ""
  });
  console.log(" > Press u to update reports to compare.");

  rl.once("line", char => {
    switch(char) {
      case 'u':
        rimraf.sync(dirToCompare);
        fse.copySync(coverageDir, dirToCompare);
        console.log();
        break;
      default:
        // noop
    }
    rl.close();
  });
}

const checkHTML = function() {
  const extractor = {
    getTable: function($) {
      return $("table.coverage");
    },
    getCode: function($) {
      return $(".prettyprint");
    },
    removeFooter: function($) {
      const footer = $("body div[class='footer quiet pad2 space-top1 center small']");
      footer.remove();
      return $;
    }
  }

  const check = {
    diff: function(htmlFile) {
      const result = {
        "Differed": "",
        "Added": ""
      }
      const relativePath = path.relative(coverageDir, htmlFile);
      const fileToCompare = path.resolve(dirToCompare, relativePath);
      if (fs.existsSync(fileToCompare)) {
        if (getHTML(htmlFile, extractor.getCode) !== getHTML(fileToCompare, extractor.getCode)) {
          result["Differed"] = htmlFile;
        }
      } else {
        result["Added"] = htmlFile;
      }
      return result;
    },
    existence: function(htmlFile) {
      const result = {
        "Removed": ""
      }
      const relativePath = path.relative(dirToCompare, htmlFile);
      const fileToCheckExistence = path.resolve(coverageDir, relativePath);
      if (!fs.existsSync(fileToCheckExistence)) {
        result["Removed"] = fileToCheckExistence;
      }
      return result;
    }
  }

  const getHTML = function(htmlFile, extract) {
    const htmlData = fs.readFileSync(htmlFile);
    const $ = cheerio.load(htmlData);
    return extract($).html();
  }

  this.verify = function(coverageDir, dirToCompare) {
    const buffer = {
      "Differed": [],
      "Added": [],
      "Removed": []
    };

    const message = ["===== Check HTML ====="];

    const htmlFilesFromCoverageDir = glob.sync(path.resolve(coverageDir, "**/*.html")).filter(filepath => {
      return path.basename(filepath) !== "index.html";
    });
    htmlFilesFromCoverageDir.forEach(htmlFile => {
      const result = check.diff(htmlFile);
      Object.keys(result).forEach(key => {
        if (result[key]) {
          buffer[key].push(result[key]);
        }
      });
    });
    
    const htmlFilesFromDirToCompare = glob.sync(path.resolve(dirToCompare));
    htmlFilesFromDirToCompare.forEach(htmlFile => {
      const result = check.existence(htmlFile);
      Object.keys(result).forEach(key => {
        if (result[key]) {
          buffer[key].push(result[key]);
        }
      });
    });
    
    const isAllReportIdentical = Object.values(buffer).reduce((accumulator, currentValue) => {
      return accumulator + currentValue.length;
    }, 0) === 0;

    if (isAllReportIdentical) {
      message.push("✨  All files are identical.");
    } else {
      ["Differed", "Added", "Removed"].forEach(key => {
        buffer[key].forEach(filePath => {
          message.push(`[${key}] ${filePath}`);
        })
      });
    }

    return {
      identicality: isAllReportIdentical,
      message: message.join("\n")
    };
  }
}

const checkJson = function() {
  const message = ["===== Check JSON ====="];
  this.verify = function(jsonPathCoverage, jsonPathToCompare) {
    let isIdentical;
    const missingFile = [];
    if (!fs.existsSync(jsonPathCoverage)) {
      missingFile.push(jsonPathCoverage);
    }
    if (!fs.existsSync(jsonPathToCompare)) {
      missingFile.push(jsonPathToCompare);
    }

    if (missingFile.length === 0) {
      const jsonCoverage = JSON.parse(fs.readFileSync(jsonPathCoverage));
      const jsonToCompare = JSON.parse(fs.readFileSync(jsonPathToCompare));
      isIdentical = JSON.stringify(jsonCoverage) === JSON.stringify(jsonToCompare);
      if (isIdentical) {
        message.push("✨  Json report is identical.");
      } else {
        message.push("🚨  Json report is not identical.");
      }
    } else {
      isIdentical = false;
      message.push(missingFile.map(filePath => `[Missing] ${filePath}`).join("\n"));
    }

    return {
      identicality: isIdentical,
      message: message.join("\n")
    };
  }
}

preprocess(
  path.resolve(coverageDir, htmlReportDirPath),
  path.resolve(dirToCompare, htmlReportDirPath)
);
const result = [];
const cHTML = new checkHTML();
const cJson = new checkJson();
result.push(cHTML.verify(
  path.resolve(coverageDir, htmlReportDirPath),
  path.resolve(dirToCompare, htmlReportDirPath)
));
result.push(cJson.verify(
  path.resolve(coverageDir, jsonReportFilePath),
  path.resolve(dirToCompare, jsonReportFilePath)
));

const isAllReportIdentical = result.reduce((accumulator, currentValue) => {
  console.log(currentValue.message, "\n");
  return accumulator && currentValue.identicality;
}, true);
if (!isAllReportIdentical) {
  askUpdate(coverageDir, dirToCompare);
}