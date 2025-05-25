/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const vision = require('@google-cloud/vision');
const cors = require('cors')({ origin: true });

const client = new vision.ImageAnnotatorClient();

exports.detectIngredients = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { imageBase64 } = req.body;
      const [result] = await client.labelDetection({ image: { content: imageBase64 } });
      const labels = result.labelAnnotations.map(label => label.description.toLowerCase());
      res.json({ labels });
    } catch (error) {
      console.error('Vision API error:', error);
      res.status(500).send("Failed to process image");
    }
  });
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
