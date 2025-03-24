import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";

const app = express();
const port = 4000; // You can choose any port you like

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Expose the /assets folder so that it can serve new files
app.use('/', express.static(path.join(__dirname, 'public')));
// app.get('/', (req,res) => {
//     console.log("Hello");
//     res.send("Hello");
// })

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});