import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const savedGames = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "../../client/TicTacToe");

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(clientPath));

app.get("/boards", (_req, res) => {
  res.status(200).json(savedGames);
});

app.post("/boards", (req, res) => {
  const board = req.body;
  if (!board || !Array.isArray(board.board)) {
    return res.status(400).json({ message: "A valid board is required" });
  }

  const existingIndex = savedGames.findIndex((game) => game.id === board.id);

  if (existingIndex >= 0) {
    savedGames[existingIndex] = board;
    return res.status(200).json({ message: "Board updated" });
  }

  savedGames.push(board);
  res.status(201).json({ message: "Board stored" });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server running on ${url}`);
});