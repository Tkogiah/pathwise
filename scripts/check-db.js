#!/usr/bin/env node

const net = require('net');

const DEFAULT_URL =
  'postgresql://pathwise:pathwise@localhost:5432/pathwise_dev';
const dbUrl = process.env.DATABASE_URL || DEFAULT_URL;

let host = 'localhost';
let port = 5432;

try {
  const url = new URL(dbUrl);
  if (url.hostname) host = url.hostname;
  if (url.port) port = Number(url.port);
} catch {
  // If DATABASE_URL is malformed, fall back to defaults.
}

const socket = new net.Socket();
const timeoutMs = 2000;

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

socket.setTimeout(timeoutMs);

socket.once('error', () => {
  fail(
    `Database not reachable at ${host}:${port}. Start Postgres and retry.\n` +
      `If you use a different DB host/port, set DATABASE_URL before running tests.`,
  );
});

socket.once('timeout', () => {
  socket.destroy();
  fail(
    `Database connection timed out at ${host}:${port}. Start Postgres and retry.`,
  );
});

socket.connect(port, host, () => {
  socket.end();
  process.exit(0);
});
