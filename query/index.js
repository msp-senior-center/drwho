const axios = require('axios');
const COGNITIVE_SERVICE_ENDPOINT ='https://southeastasia.api.cognitive.microsoft.com/face/v1.0';
const API_KEY = process.env.COGNITIVE_SERVICE_API_KEY;
const FACE_LIST_ID = 'my-face-list';
const FACE_API_GET = COGNITIVE_SERVICE_ENDPOINT + '/facelists/' + FACE_LIST_ID;
const FACE_API_DETECT_ENDPOINT = COGNITIVE_SERVICE_ENDPOINT + '/detect';
const FACE_API_FIND_SIMILARS_ENDPOINT = COGNITIVE_SERVICE_ENDPOINT + '/findsimilars';


module.exports = async function (context, req) {
    const responseGetFaceList = await axios.get(FACE_API_GET, {
        headers: {
            'Ocp-Apim-Subscription-Key': API_KEY,
        }
    })
    var persistedFaceMap = {};
    for (const persistedFace of responseGetFaceList.data.persistedFaces) {
        persistedFaceMap[persistedFace.persistedFaceId] = persistedFace.userData;
    }

    const responseDetect = await axios.post(
        FACE_API_DETECT_ENDPOINT, 
        req.body, 
        {
            headers: {
                'Ocp-Apim-Subscription-Key': API_KEY,
                'Content-Type': 'application/octet-stream'
            }
        }
    );

    const detectedFaceList = responseDetect.data;
    var foundNames = [];
    for (const detectedFace of detectedFaceList) {
        var copied = Object.assign({}, detectedFace);
        copied.faceListId = FACE_LIST_ID;
        const responseFindSimilars = await axios.post(
            FACE_API_FIND_SIMILARS_ENDPOINT,
            copied,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        for (const item of responseFindSimilars.data) {
            foundNames.push(persistedFaceMap[item.persistedFaceId]);
        }
    }

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: foundNames
    };
};