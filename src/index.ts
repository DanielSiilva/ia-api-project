import axios from "axios";
import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 3000;

app.use(express.json());

let collectionUser: any;

export async function connectUserCollection() {
  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  collectionUser = client.db("vtex_test_ia").collection("vtex_pacotes");
}

async function getUserData(): Promise<any> {
  const client = new MongoClient("mongodb://localhost:27017", {});

  try {
    await client.connect();
    const collectionUser = client.db("vtex_test_ia").collection("vtex_pacotes");

    const userData = await collectionUser.findOne({ orderId: "v774982crb-01" });

    return userData;
  } catch (error) {
    throw new Error(`Erro ao buscar dados do usuário: ${error}`);
  } finally {
    await client.close();
  }
}

async function getModelResponse(prompt: string): Promise<string> {
  const userData = await getUserData();
  console.log("userData", userData);

  let context = {};

  // Mudar o contexto dependendo doque o usuario perguntar
  if (prompt.toLowerCase().includes("cliente")) {
    context = userData.clientProfileData;
  }

  try {
    const response = await axios.post(
      "http://34.45.116.129:11434/v1/chat/completions",
      {
        model: "llama3",
        messages: [
          {
            role: "system",
            content:
              "You are a specialist assistant. You should answer all questions in Portuguese, always in a direct manner. At the end of each response, say: 'Gostaria de saber se você precisa de mais alguma coisa.' When responding, always refer to the clientProfileData field in the provided context (in JSON format). If the requested information is not present in this field, state that the information was not found or provide the closest possible answer, always considering the context.",
          },
          {
            role: "user",
            content: prompt,
          },
          {
            role: "user",
            content: JSON.stringify(context),
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
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
