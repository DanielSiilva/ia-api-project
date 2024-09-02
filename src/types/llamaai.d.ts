declare module "llamaai" {
  class LlamaAI {
    constructor(apiToken: string);
    run(apiRequestJson: any): Promise<any>;
  }
  export default LlamaAI;
}
