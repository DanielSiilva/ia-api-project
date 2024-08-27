import { Tool } from "langchain/tools";
import { MongoClient } from "mongodb";

// Conectando à coleção `local_users` no banco de dados `7SYYB-TY4RM-4UK7A-DG8MN`
let collectionUser: any;

export async function connectUserCollection() {
  const client = new MongoClient("mongodb://localhost:27017", {
    driverInfo: { name: "langchainjs" },
  });
  await client.connect();
  collectionUser = client
    .db("7SYYB-TY4RM-4UK7A-DG8MN")
    .collection("local_users");
}

export class MongoUserQueryTool extends Tool {
  name = "mongo-user-query";
  description = "Faz consultas à coleção local_users no MongoDB.";

  async _call(input: string): Promise<string> {
    try {
      const query = JSON.parse(input);
      console.log("input", input); // Supondo que o input seja um JSON stringificado
      const results = await collectionUser.find(query).toArray();
      console.log("results", results); // Realizando a busca no MongoDB
      return JSON.stringify(results); // Retornando os resultados como string
    } catch (error: any) {
      return `Erro ao executar a consulta no MongoDB: ${error.message}`;
    }
  }
}
