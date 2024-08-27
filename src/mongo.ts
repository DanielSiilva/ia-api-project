import { MongoClient, ObjectId } from "mongodb";

let collection: any;
let collectionUser: any;
let sessionId: any;

export async function connectMongoDB() {
  const client = new MongoClient("mongodb://localhost:27017", {
    driverInfo: { name: "langchainjs" },
  });

  await client.connect();
  collection = client.db("langchain").collection("memory");
  sessionId = new ObjectId().toString();

  collectionUser = client
    .db("7SYYB-TY4RM-4UK7A-DG8MN")
    .collection("local_users");
}

export { collection, sessionId, collectionUser };

// import { Tool } from 'langchain/tools';
// import { MongoClient } from 'mongodb';

// // Conectando à coleção `local_users` no banco de dados `7SYYB-TY4RM-4UK7A-DG8MN`
// let collectionUser;

// export async function connectUserCollection() {
//   const client = new MongoClient("mongodb://localhost:27017", {
//     driverInfo: { name: 'langchainjs' },
//   });
//   await client.connect();
//   collectionUser = client.db("7SYYB-TY4RM-4UK7A-DG8MN").collection("local_users");
// }

// export class MongoUserQueryTool extends Tool {
//   name = 'mongo-user-query';
//   description = 'Faz consultas à coleção local_users no MongoDB.';

//   async _call(input: string): Promise<string> {
//     try {
//       const query = JSON.parse(input); // Supondo que o input seja um JSON stringificado
//       const results = await collectionUser.find(query).toArray(); // Realizando a busca no MongoDB
//       return JSON.stringify(results); // Retornando os resultados como string
//     } catch (error:any) {
//       return `Erro ao executar a consulta no MongoDB: ${error.message}`;
//     }
//   }
// }
