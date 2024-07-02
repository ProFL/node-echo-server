import { tmpdir } from "node:os";

import express from "express";

import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());

const upload = multer({ dest: tmpdir() });

app.all("*", upload.any(), async function (req, res) {
    const filteredHeaders = req.headers;
    Object.keys(filteredHeaders).forEach((key) => {
        if (!key.startsWith("cf-")) {
            return;
        }

        delete filteredHeaders[key];
    });

    const requestData = {
        request: {
            method: req.method,
            path: req.originalUrl,
            headers: filteredHeaders,
            params: req.query,
            body: req.body,
        },
    };
    console.dir(requestData);
    res.json(requestData);
});

const port = parseInt(process.env.PORT ?? "8080", 10);

if (isNaN(port)) {
    console.error("PORT (env var) is not a number");
    process.exit(1);
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
