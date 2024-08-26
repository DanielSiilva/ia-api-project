import express, { Request, Response } from "express";
import axios from "axios";

const app = express();
const port = 3000;

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Endpoint que interage com o modelo
app.get("/hello/:name", async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: name,
      stream: false,
    });
    const respData = response.data.response.toString();
    res.send(respData);
  } catch (error) {
    res.status(500).send(`Erro ao executar comandos: ${error}`);
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
