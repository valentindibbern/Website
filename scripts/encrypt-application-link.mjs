import { readFile, writeFile } from "node:fs/promises";
import { webcrypto } from "node:crypto";

const secretsPath = new URL("../.application-secrets.local.json", import.meta.url);
const outputPath = new URL("../src/config/applicationAccess.ts", import.meta.url);
const iterations = 600000;

const secrets = JSON.parse(await readFile(secretsPath, "utf8"));

if (!isNonEmptyString(secrets.password) || !isNonEmptyString(secrets.url)) {
    throw new Error(
        "Expected .application-secrets.local.json with non-empty password and url fields.",
    );
}

const encoder = new TextEncoder();
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));
const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    encoder.encode(secrets.password),
    "PBKDF2",
    false,
    ["deriveKey"],
);
const key = await webcrypto.subtle.deriveKey(
    {
        name: "PBKDF2",
        hash: "SHA-256",
        salt,
        iterations,
    },
    keyMaterial,
    {
        name: "AES-GCM",
        length: 256,
    },
    false,
    ["encrypt"],
);
const encrypted = await webcrypto.subtle.encrypt(
    {
        name: "AES-GCM",
        iv,
    },
    key,
    encoder.encode(secrets.url),
);

const payload = {
    kdf: "PBKDF2-SHA-256",
    cipher: "AES-GCM",
    iterations,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(encrypted)),
};

await writeFile(
    outputPath,
    `export const applicationAccessPayload = ${JSON.stringify(payload, null, 4)} as const;\n`,
);

console.log("Wrote encrypted application access payload.");

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function toBase64(bytes) {
    return Buffer.from(bytes).toString("base64");
}
