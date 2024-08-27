import { ChatOllama } from "@langchain/ollama";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createStructuredChatAgent, AgentExecutor } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { connectMongoDB, collection, sessionId } from "./mongo";
import { MongoUserQueryTool, connectUserCollection } from "./mongoQueryTool";

async function main() {
  // Conectando ao MongoDB para salvar o histórico de chat
  await connectMongoDB();

  // Conectando à coleção `local_users` para consultas de usuários
  await connectUserCollection();

  // Configuração do modelo LLM
  const llm = new ChatOllama({
    model: "llama3.1",
    streaming: true,
    temperature: 0,
  });

  // Definindo as ferramentas
  const tools = [new MongoUserQueryTool()];

  // Definindo o template de prompt
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Respond to the human as helpfully and accurately as possible. You have access to the following tools:

      {tools}

      Use a json blob to specify a tool by providing an action key (tool name) and an action_input key (tool input).

      Valid "action" values: "Final Answer" or {tool_names}

      Provide only ONE action per $JSON_BLOB, as shown:

      \`\`\`
      {{
        "action": $TOOL_NAME,
        "action_input": $INPUT
      }}
      \`\`\`

      Follow this format:
      Question: input question to answer
      Thought: consider previous and subsequent steps
      Action:
      \`\`\`
      $JSON_BLOB
      \`\`\`
      Observation: action result
      ... (repeat Thought/Action/Observation N times)
      Thought: I know what to respond
      Action:
      \`\`\`
      {{
        "action": "Final Answer",
        "action_input": "Final response to human"
      }}

      Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. Respond directly if appropriate. Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation`,
    ],
    ["placeholder", "{chat_history}"],
    [
      "human",
      `{input}

      {agent_scratchpad}
      (reminder to respond in a JSON blob no matter what)`,
    ],
  ]);

  // Criando o agente de chat
  const agent = await createStructuredChatAgent({
    llm,
    tools,
    prompt,
  });

  // Configuração da memória do agente
  const memory = new BufferMemory({
    chatHistory: new MongoDBChatMessageHistory({
      collection,
      sessionId,
    }),
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "output",
  });

  // Criando o executor do agente
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    memory,
    maxIterations: 1,
  });

  // Testando o agente com a busca por "Daniel Sousa"
  const res1 = await agentExecutor.invoke({
    input: '{"name": "Daniel Sousa"}', // Consultando a coleção `local_users` por um nome específico
  });

  console.log("Resultado da Consulta:", res1);

  // Segundo teste: perguntando ao agente sobre o nome
  const res2 = await agentExecutor.invoke({
    input: "What is my name?",
  });

  console.log("Resultado da Pergunta:", res2);
}

// Executando a função principal
main().catch(console.error);
