// import express, { Request, Response } from "express";
// import { ChatOllama } from "@langchain/ollama";
// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
// } from "@langchain/core/prompts";
// import { createStructuredChatAgent, AgentExecutor } from "langchain/agents";
// import { BufferMemory } from "langchain/memory";
// import { MongoDBChatMessageHistory } from "@langchain/mongodb";
// import { connectMongoDB, collection, sessionId } from "./mongo";
// import { MongoUserQueryTool, connectUserCollection } from "./mongoQueryTool";

// const app = express();
// app.use(express.json());

// let agentExecutor: AgentExecutor | null = null;

// async function setupAgent() {
//   // Conectando ao MongoDB para salvar o histórico de chat
//   await connectMongoDB();

//   // Conectando à coleção `local_users` para consultas de usuários
//   await connectUserCollection();

//   // Configuração do modelo LLM
//   const llm = new ChatOllama({
//     model: "llama3.1",
//     streaming: true,
//     temperature: 0,
//   });

//   // Definindo as ferramentas
//   const tools = [new MongoUserQueryTool()];

//   // Definindo o template de prompt
//   const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
//       `You are a helpful assistant. You have access to the following tools to assist the user:

//       {tools}

//       If the user asks about someone, query the 'local_users' collection and include the result in your response.

//       Use a json blob to specify a tool by providing an action key (tool name) and an action_input key (tool input).

//       Valid "action" values: "Final Answer" or {tool_names}

//       After providing the response, always ask: "What more can I help you with?"

//       Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation`,
//     ],
//     ["placeholder", "{chat_history}"],
//     [
//       "human",
//       `{input}

//       {agent_scratchpad}
//       (reminder to respond in a JSON blob no matter what)`,
//     ],
//   ]);

//   // Criando o agente de chat
//   const agent = await createStructuredChatAgent({
//     llm,
//     tools,
//     prompt,
//   });

//   // Configuração da memória do agente
//   const memory = new BufferMemory({
//     chatHistory: new MongoDBChatMessageHistory({
//       collection,
//       sessionId,
//     }),
//     memoryKey: "chat_history",
//     inputKey: "input",
//     outputKey: "output",
//   });

//   // Criando o executor do agente
//   agentExecutor = new AgentExecutor({
//     agent,
//     tools,
//     memory,
//     maxIterations: 20,
//   });
// }

// app.post("/chat", async (req: Request, res: Response) => {
//   try {
//     const { input } = req.body;
//     console.log("input", input);

//     if (!agentExecutor) {
//       return res.status(500).json({ error: "Agent not initialized" });
//     }

//     const result = await agentExecutor.invoke({ input });
//     res.json({ result });
//   } catch (error) {
//     console.error("Erro no chat:", error);
//     res.status(500).json({ error: "Erro ao processar a solicitação" });
//   }
// });

// app.listen(3000, async () => {
//   console.log("Servidor rodando na porta 3000");
//   await setupAgent(); // Inicializa o agente ao iniciar o servidor
// });
