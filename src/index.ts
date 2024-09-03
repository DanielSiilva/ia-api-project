import axios from "axios";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

let chatHistory: Array<{ prompt: string; response: string }> = [];

// Executar a função - consulta runtask.
async function getModelResponse(
  prompt: string,
  filter: any,
  roleSystem: string,
  contentSystem: string,
  temperature: number,
  max_tokens: number,
  roleUser: string
): Promise<string> {
  const externalApiResponse = await axios.post(
    "https://api.devel.runtask.com/api/mp_packages_tratado/filter?$size=50&$page=1",
    {
      filter: filter,
    },
    {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTM2NSwiaWF0IjoxNzAxMTAzOTM4fQ.4z3rzM5fq4_65_BBuaau5QyRf3DZNTHjOm6EceeQ7Nk",
      },
    }
  );

  const content = externalApiResponse.data?.data[0];

  try {
    const response = await axios.post(
      "http://34.45.116.129:11434/v1/chat/completions",
      {
        model: "llama3.1:8b",
        messages: [
          {
            role: roleSystem,
            content: contentSystem,
          },
          {
            role: roleUser,
            content: prompt,
          },
          {
            role: roleUser,
            content: JSON.stringify(content),
          },
        ],
        temperature: temperature,
        max_tokens: max_tokens,
      }
    );

    const responseData = response.data.choices[0].message.content;

    // Armazenar no histórico
    chatHistory.push({ prompt, response: responseData });

    return responseData;
  } catch (error) {
    throw new Error(`Erro ao executar comandos: ${error}`);
  }
}

app.post("/chat", async (req: Request, res: Response) => {
  const {
    prompt,
    filter,
    roleSystem,
    contentSystem,
    temperature,
    max_tokens,
    roleUser,
  } = req.body;

  try {
    const response = await getModelResponse(
      prompt,
      filter,
      roleSystem,
      contentSystem,
      temperature,
      max_tokens,
      roleUser
    );

    // Exibir histórico no console
    console.log("Histórico do chat:");
    chatHistory.forEach((entry, index) => {
      console.log(`Interação ${index + 1}:`);
      console.log(`Usuário perguntou: ${entry.prompt}`);
      console.log(`Llama respondeu: ${entry.response}`);
    });

    res.json({ response });
  } catch (error: any) {
    console.error("Erro no chat:", error);
    res.status(500).json({ error: "Erro ao processar a solicitação" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
