import axios from "axios";
import delay from "../functions/delay";
import { AiFillDatabase } from "react-icons/ai";
import endpoint from "./_domain";
import { originHeader } from "./_domain";
export async function getDocument(token, documentId) {
    let response = await axios.get(`${endpoint}/api/documents/detail/${documentId}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    return response.data.data
}

export async function getCompanyDocument(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function getMyDocuments(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix/me?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function getSharedDocuments(token, page, page_size) {
    console.log("endpoint: ", endpoint)
    let response = await axios.get(`${endpoint}/api/documents/matrix/shared?page=${page}&page_size=${page_size}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
            ...originHeader
        }
    })
    console.log("response: ", response)
    return response.data.data
}

export async function extractMetadata(newForm) {
    // await delay(4000)
    let rawResponse = null
    let i = 0
    while (rawResponse?.data?.data == null) {
        console.log("Number of loop: ", i)
        // rawResponse = await axios.post(`${endpoint}/api/ocr`, newForm, {
        //     headers: {
        //         ...originHeader
        //     }
        // })
        rawResponse = await axios.get(`http://localhost:3000/data/metadata.json`)
        if (rawResponse.data.data) {
            return rawResponse.data.data
        }
        console.log("rawResponse", rawResponse)
        i += 1
    }
    // const rawResponse = await axios.get('http://localhost:3000/data/metadata.json')
    // return rawResponse.data.data
}

export async function saveDocumentToCloud(token, data) {
    // await delay(1000)
    console.log("token: ", token)
    console.log("data: ", data)
    let rawResponse = await axios.post(`${endpoint}/api/documents/create`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    // return 1
    console.log("rawResponse in saveDocument: ", rawResponse)
    return rawResponse.data
}

export async function updateMetadata(token, uid, data) {
    // await delay(2000)
    const rawResponse = await axios.post(`${endpoint}/api/documents/update/${uid}`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            ...originHeader
        }
    })
    console.log("updateMetadataResponse", rawResponse)
    // const rawResponse = await axios.get('http://localhost:3000/data/metadata.json')
    return rawResponse.data.data
}

export async function convertToPng(pdfUrl) {
    try {
        // Fetch the PDF file from the predefined URL using Axios
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

        // Use pdf.js to parse the PDF
        const pdf = await window.pdfjsLib.getDocument(response.data).promise;

        // Get the first page
        const page = await pdf.getPage(1);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        // Convert canvas content to PNG
        const pngDataUrl = canvas.toDataURL('image/jpg');
        console.log(pngDataUrl);
        // setPngUrl(pngDataUrl)
        return pngDataUrl
        // Use pngDataUrl for your purpose, e.g., displaying it or downloading it
    } catch (error) {
        console.error('There was a problem fetching or processing the PDF:', error);
    }
};

export async function convertToJpg(pdfUrl) {
    try {
        // Fetch the PDF file from the predefined URL using Axios
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

        // Use pdf.js to parse the PDF
        const pdf = await window.pdfjsLib.getDocument(response.data).promise;

        // Get the first page
        const page = await pdf.getPage(1);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        // Convert canvas content to JPEG
        const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality as needed (0.0 - 1.0)

        // Use jpgDataUrl for your purpose, e.g., displaying it or downloading it
        console.log(jpgDataUrl);
        return jpgDataUrl
    } catch (error) {
        console.error('There was a problem fetching or processing the PDF:', error);
    }
};

export async function convertFileToJpg(pdfFile) {
    try {
        if (!pdfFile) {
            console.error('No PDF file selected.');
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = async () => {
            // Use pdf.js to parse the PDF
            const arrayBuffer = fileReader.result;
            const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;

            // Get the first page
            const page = await pdf.getPage(1);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // Convert canvas content to JPEG
            const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality as needed (0.0 - 1.0)

            // Use jpgDataUrl for your purpose, e.g., displaying it or downloading it
            console.log(jpgDataUrl);
        };

        fileReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
        console.error('There was a problem processing the PDF:', error);
    }
};