// index.js
import express from 'express';

const app = express();
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});