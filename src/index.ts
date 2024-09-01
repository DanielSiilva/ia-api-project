import axios from "axios";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

async function getModelResponse(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      "http://34.45.116.129:11434/v1/chat/completions",
      {
        model: "llama3",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }
    );

    console.log("🚀 ~ response:", response.data);

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`Erro ao executar comandos: ${error}`);
  }
}

app.post("/chat", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  console.log("prompt", prompt);

  try {
    const response = await getModelResponse(prompt);
    res.json({ response });
  } catch (error: any) {
    console.error("Erro no chat:", error);
    res.status(500).json({ error: "Erro ao processar a solicitação" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
