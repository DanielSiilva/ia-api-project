const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

// Configurações
const endpointUrl =
  "https://us-central1-aiplatform.googleapis.com/v1/projects/542760050051/locations/us-central1/endpoints/348745297121247232:predict";
const accessToken =
  "ya29.a0AcM612ygdmc7hx1_3P1dkxjiu4DWqinEatt5WarjtwsC3kswTDS4-fbgGbKOc-8iiEhXkVNop4GPAdCjKIODLl65fHYGLBMRxY4uTaHnyBuTrv43kmKhQup7gxdLkg_fVBVMmviIIakGuqpiUXWNjZPgJi2ZQESu9EHQRtIKUnYFsUWJaCgYKAS8SARESFQHGX2Mi2EOJSA03IHoR0EPa4CDc0w0183";

app.use(express.json());

app.post("/predict", async (req, res) => {
  try {
    // Verifica se o corpo da requisição tem o campo 'instances'
    const instances = req.body.instances;
    if (!instances || !Array.isArray(instances)) {
      return res
        .status(400)
        .send(
          'Invalid request: "instances" field is required and should be an array.'
        );
    }

    // Prepara o corpo da requisição para o Google Cloud AI Platform
    const requestBody = {
      instances: instances,
    };

    // Faz a requisição ao endpoint da Vertex AI usando Axios
    const response = await axios.post(endpointUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Envia a resposta do modelo de volta ao cliente
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error during prediction:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
