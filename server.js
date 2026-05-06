const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;
const PORT = Number(process.env.PORT || 4175);

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  return mimeTypes[extension] || "application/octet-stream";
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", getMimeType(filePath));
    res.end(content);
  });
}

function getStaticFilePath(requestUrl) {
  const parsedUrl = new URL(requestUrl, `http://localhost:${PORT}`);
  const decodedPath = decodeURIComponent(parsedUrl.pathname);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = safePath === "/" ? "/index.html" : safePath;
  const filePath = path.join(ROOT_DIR, requestedPath);

  if (!filePath.startsWith(ROOT_DIR)) {
    return path.join(ROOT_DIR, "index.html");
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  sendFile(res, getStaticFilePath(req.url || "/"));
});

server.listen(PORT, () => {
  console.log(`ActivityVault running at http://127.0.0.1:${PORT}`);
});
