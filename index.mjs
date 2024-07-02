import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { pipeline } from "node:stream/promises";

import { fastifyMultipart } from "@fastify/multipart";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });
fastify.register(fastifyMultipart);

fastify.all("*", async function (request, response) {
    const filteredHeaders = request.headers;
    Object.keys(filteredHeaders).forEach((key) => {
        if (!key.startsWith("cf-")) {
            return;
        }

        delete filteredHeaders[key];
    });

    let body = request.body;

    if (request.headers["content-type"] == "multipart/form-data") {
        const [file] = await request.saveRequestFiles();

        if (file) {
            const { fields, filepath, ...fileMeta } = file;

            body = {
                ...body,
                multipartFormData: {
                    ...fileMeta,
                    ...fields,
                }
            };
        }
    }

    const requestData = {
        request: {
            method: request.method,
            path: request.originalUrl,
            headers: filteredHeaders,
            params: request.query,
            body: body,
        },
    };
    console.dir(requestData);
    response.send(requestData);
});

fastify.listen({ port: 8080, host: "0.0.0.0" }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server is now listening on ${address}`);
});
