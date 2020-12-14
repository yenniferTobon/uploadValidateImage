const photoServi = require('../services/photoService');
const ReqFieldException = require('../exceptions/ReqFieldException');
const Photo = require('../models/photoModels');

exports.uploadPhoto = async(req, res) => {
    /***************************************************
     * Definción de variables
     ***************************************************/
    let path = req.file.path,
        new_width = 0,
        new_height = 0,
        jsonResp = new Object();

    /***************************************************
     * Consulta de dimensiones actuales de la imagen
     ***************************************************/
    let photo_dimensions = await photoServi.getSizePhoto(path);

    /***************************************************
     * Calculo de nuevas dimensiones de imagen
     ***************************************************/
    let new_dimensions = await photoServi.calculateNewImageValues(
        path,
        photo_dimensions
    );
    new_height = new_dimensions.height_new;
    new_width = new_dimensions.width_new;

    /***************************************************
     * Modificación de imagen en casod e ser necesario
     ***************************************************/
    var newPath = path;
    if (new_dimensions.change_img === true) {
        newPath = await photoServi.changeSizeNewPhoto(
            path,
            new_width,
            new_height
        );
    }
    jsonResp.photoPathUpdate = newPath;

    /***************************************************
     * Construcción del JSON Final
     ***************************************************/
    jsonResp.photoPath = path;
    jsonResp.title = req.body.title;
    jsonResp.idTrx = req.body.idTrx;
    jsonResp.photo_height = photo_dimensions.height;
    jsonResp.photo_width = photo_dimensions.width;
    jsonResp.new_height = new_height;
    jsonResp.new_width = new_width;

    /***************************************************
     * Guardar Datos en BD MongoDB
     ***************************************************/
    let photo_finish = await photoServi.saveInfoBD(jsonResp);
    res.status(200).send(photo_finish);
};

exports.getInfoPhoto = async(req, res) => {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    return res.json(photo);
};

exports.getPhotos = async(req, res) => {
    let idTrx = req.params;
    let photos = await photoServi.getBulkPhotos(idTrx);
    res.status(200).send(photos);
};