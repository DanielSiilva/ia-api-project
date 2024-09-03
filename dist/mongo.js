"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionUser = exports.sessionId = exports.collection = void 0;
exports.connectMongoDB = connectMongoDB;
const mongodb_1 = require("mongodb");
let collection;
let collectionUser;
let sessionId;
async function connectMongoDB() {
    const client = new mongodb_1.MongoClient("mongodb://localhost:27017", {
        driverInfo: { name: "langchainjs" },
    });
    await client.connect();
    exports.collection = collection = client.db("langchain").collection("memory");
    exports.sessionId = sessionId = new mongodb_1.ObjectId().toString();
    exports.collectionUser = collectionUser = client
        .db("7SYYB-TY4RM-4UK7A-DG8MN")
        .collection("local_users");
}
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
