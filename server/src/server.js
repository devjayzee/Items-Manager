import express from 'express';
import cors from 'cors';
import itemsRouter from "./routes/items.route";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use('/api/items', itemsRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});