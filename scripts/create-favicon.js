const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function createFavicon() {
    try {
        console.log('Buscando imagen base...');
        // The user uploaded an image. In this environment, we can fetch the image from the conversation context if possible, 
        // or since we are a text-based AI without direct file-system access to the chat upload buffer, 
        // we'll download a placeholder flower image or use a base64 string to generate it locally.

        // Dado que no puedo extraer la imagen del chat de forma programática directa a tu disco C:,
        // descargaré provisionalmente una imagen de Papiro similar libre de derechos y la procesaré.

        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Papyrus_flower.svg/512px-Papyrus_flower.svg.png";

        const image = await Jimp.read(imageUrl);

        const targetPath = path.join(__dirname, 'public', 'images', 'favicon.png');

        // Redimensionar a 192x192 garantizando la cuadratura
        await image.resize(192, 192).writeAsync(targetPath);

        console.log('Favicon de Papiro generado y guardado exitosamente en: ' + targetPath);
    } catch (err) {
        console.error('Error procesando el Favicon: ', err);
    }
}

createFavicon();
