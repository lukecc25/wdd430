import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { createContext } from './context.js';
import { ensureSeeded } from './lessonService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');
const PORT = Number(process.env.PORT) || 4000;

await ensureSeeded();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

await server.start();

app.get('/health', (_, res) => res.json({ ok: true }));

app.use(
  '/graphql',
  cors({ origin: true, credentials: true }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => createContext({ req }),
  })
);

const indexHtml = path.join(clientDist, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(clientDist, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(indexHtml);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[graphql] http://0.0.0.0:${PORT}/graphql`);
  if (fs.existsSync(indexHtml)) {
    console.log(`[static] serving ${clientDist}`);
  }
});
