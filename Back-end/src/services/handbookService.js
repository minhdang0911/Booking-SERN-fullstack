import db from '../models/index';
let createHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters',
                });
            } else {
                await db.Handbook.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Handbook.findAll({});
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');

                    return item;
                });
            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createHandbook: createHandbook,
    getAllHandBook: getAllHandBook,
};
