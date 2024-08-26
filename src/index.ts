import { MongoClient } from "mongodb";
import ollama from "ollama";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let database: any;

async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db("7SYYB-TY4RM-4UK7A-DG8MN");
    console.log("Conectado ao banco de dados MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}

async function getModelResponse(
  prompt: string,
  context: object
): Promise<string> {
  try {
    const contextString = JSON.stringify(context);

    const response = await ollama.chat({
      model: "llama3.1",

      messages: [
        {
          role: "system",
          content: `Use these data to answer questions: ${contextString}`,
        },
        { role: "user", content: prompt },
      ],
    });
    console.log("🚀 ~ response:", response);

    return response.message.content;
  } catch (error) {
    throw new Error(`Erro ao executar comandos: ${error}`);
  }
}

app.post("/query/:collection/:query", async (req: Request, res: Response) => {
  const { collection, query } = req.params;
  const { prompt } = req.body;

  console.log("collection", collection);
  console.log("query", query);

  console.log("prompt", prompt);

  try {
    const coll = database.collection(collection);
    const queryObject = JSON.parse(query);
    const documents = await coll.find(queryObject).toArray();

    if (documents.length === 0) {
      res.status(404).send("Nenhum documento encontrado.");
      return;
    }

    const response = await getModelResponse(prompt, documents);

    res.send(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});
