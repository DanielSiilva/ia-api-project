import axios from "axios";
import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { clienteKeywords, containsKeyword, produtoKeywords } from "./prompt";

const app = express();
const port = 3000;

app.use(express.json());

let collectionUser: any;
let chatHistory: Array<{ prompt: string; response: string }> = []; // Array para armazenar o histórico

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

  let context = {};

  // Verifica se o prompt contém alguma palavra relacionada a "cliente"
  if (containsKeyword(prompt, clienteKeywords)) {
    context = userData.clientProfileData;
  }

  // Verifica se o prompt contém alguma palavra relacionada a "produto"
  if (containsKeyword(prompt, produtoKeywords)) {
    context = userData.items;
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
              " You are a specialist assistant. Answer all questions in Portuguese, and always be clear and direct. Only provide the information requested by the user. At the end of each response, say: Gostaria de saber se você precisa de mais alguma coisa. When responding, always refer to the clientProfileData field in the provided context (in JSON format). If the requested information is not present in this field, state that the information was not found. Do not provide additional information beyond what was asked.",
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

    const responseData = response.data.choices[0].message.content;

    // Armazenar no histórico
    chatHistory.push({ prompt, response: responseData });

    return responseData;
  } catch (error) {
    throw new Error(`Erro ao executar comandos: ${error}`);
  }
}

app.post("/chat", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  //console.log("prompt", prompt);

  try {
    // Transformar isso em uma no runtask
    const response = await getModelResponse(prompt);

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
