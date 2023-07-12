const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Servir arquivos estáticos do diretório 'dist'
app.use(express.static(path.join(__dirname, "dist")));

// Rota para servir o arquivo index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
