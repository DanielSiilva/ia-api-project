import ollama from "ollama";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;
app.use(express.json());

async function getModelResponse(prompt: string): Promise<string> {
  try {
    const response = await ollama.chat({
      model: "llama3.1",
      messages: [{ role: "user", content: prompt }],
    });

    return response.message.content;
  } catch (error) {
    throw new Error(`Erro ao executar comandos: ${error}`);
  }
}

app.get("/hello/:name", async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const response = await getModelResponse(name);
    res.send(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
