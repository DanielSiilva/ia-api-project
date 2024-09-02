export function containsKeyword(prompt: string, keywords: string[]): boolean {
  return keywords.some((keyword) => prompt.toLowerCase().includes(keyword));
}

export const clienteKeywords = [
  "cliente",
  "comprador",
  "usuario",
  "consumidor",
  "user",
  "destinatário",
  "pessoa",
  "conta",
  "perfil",
  "cadastro",
  "identidade",
  "identificação",
  "assinante",
  "pessoa física",
  "pessoa jurídica",
  "indivíduo",
  "titular",
  "dono",
  "proprietário",
  "responsável",
];

export const produtoKeywords = [
  "produto",
  "itens",
  "item",
  "compra",
  "mercadoria",
  "artigo",
  "bem",
  "material",
  "objeto",
  "produto adquirido",
  "mercadoria adquirida",
  "pedido",
  "encomenda",
  "artigo comprado",
  "produto comprado",
  "produto solicitado",
  "produto encomendado",
  "produto recebido",
  "item recebido",
  "artigo recebido",
  "material adquirido",
];
