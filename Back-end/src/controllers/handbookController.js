import handbookService from '../services/handbookService';

let createHandbook = async (req, res) => {
    try {
        let infor = await handbookService.createHandbook(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log('Error:', e.message);
        console.log('Stack trace:', e.stack);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

let getAllHandBook = async (req, res) => {
    try {
        let infor = await handbookService.getAllHandBook();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};
module.exports = {
    createHandbook: createHandbook,
    getAllHandBook: getAllHandBook,
};
