import express from "express";
import cors from "cors";
import convertRoutes from "./routes/convert.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/convert", convertRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;