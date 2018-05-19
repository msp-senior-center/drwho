const axios = require('axios');
const COGNITIVE_SERVICE_ENDPOINT ='https://southeastasia.api.cognitive.microsoft.com/face/v1.0';
const API_KEY = process.env.COGNITIVE_SERVICE_API_KEY;
const FACE_LIST_ID = 'my-face-list';


module.exports = async function (context, req) {
    const name = req.query.name;
	const addFaceAPIEndpoint = COGNITIVE_SERVICE_ENDPOINT 
        + '/facelists/' + FACE_LIST_NAME 
        + '/persistedFaces?userData=' + name;

    const response = await axios.post(
        addFaceAPIEndpoint, 
        req.body, 
        {
            headers: {
                'Ocp-Apim-Subscription-Key': API_KEY,
                'Content-Type': 'application/octet-stream'
            }
        }
    );

    context.res = {
        status: 200
    };
};