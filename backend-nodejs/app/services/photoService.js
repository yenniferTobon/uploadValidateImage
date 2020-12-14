const photoModel = require('../models/photoModels');
const sizeOf = require('image-size');
const config = require('../configs/config');
var Jimp = require('jimp');

exports.getSizePhoto = async (photoPath) => {
    const dimensions = sizeOf(photoPath);
    return dimensions;
};

exports.calculateNewImageValues = async (photoPath, photo_dimensions) => {
    let width_hoja = config.WIDTH_HOJA,
        height_hoja = config.HEIGHT_HOJA,
        width_img = 180,
        height_img = 70,
        percentage = 0,
        height_new = 0,
        width_new = 0;
    change_img = new Boolean(false);
    let jsonResp = new Object();

    height_img = photo_dimensions.height;
    width_img = photo_dimensions.width;

    if (
        (width_img <= width_hoja && height_img <= height_hoja) ||
        (width_img <= height_hoja && height_img <= width_hoja)
    ) {
        jsonResp.change_img = false;
        jsonResp.height_new = height_img;
        jsonResp.width_new = width_img;
        return jsonResp;
    }

    /************************************************************************
     * Imagen esta horizontal y debo de rotar la hoja.
     ************************************************************************/
    if (width_img > height_img && width_img > width_hoja) {
        /*******************************************************************
         * Encontrar si el cambio de tamaño esta mayor en el ancho o alto
         * de la imagen.
         *******************************************************************/
        if (width_img - height_hoja > height_img - width_hoja) {
            percentage =
                Math.ceil(((width_img - height_hoja) * 100) / width_img) / 100;
        } else {
            percentage =
                Math.ceil(((height_img - width_hoja) * 100) / height_img) / 100;
        }
        /************************************************************************
         * Imagen esta vertical.
         ************************************************************************/
    } else {
        /*******************************************************************
         * Encontrar si el cambio de tamaño esta mayor en el ancho o alto
         * de la imagen.
         *******************************************************************/
        if (width_img - width_hoja > height_img - height_hoja) {
            percentage =
                Math.ceil(((width_img - width_hoja) * 100) / width_img) / 100;
        } else {
            percentage =
                Math.ceil(((height_img - height_hoja) * 100) / height_img) /
                100;
        }
    }

    width_new = width_img - width_img * percentage;
    height_new = height_img - height_img * percentage;
    jsonResp.change_img = true;
    jsonResp.height_new = height_new;
    jsonResp.width_new = width_new;
    return jsonResp;
};

exports.changeSizeNewPhoto = async (photo, width, height) => {
    const photoNew = await Jimp.read(photo);
    await photoNew.resize(width, height);
    await photoNew.quality(100);
    var nom = photo.split('.');
    nom[0] = nom[0] + '_update';
    var rutaNew = nom[0] + '.' + nom[1];
    console.log(rutaNew);
    await photoNew.writeAsync(rutaNew);
    return rutaNew;
};

exports.saveInfoBD = async (jsonResp) => {
    const recentPhoto = photoModel(jsonResp);
    let addImage = await recentPhoto.save();
    return addImage;
};

exports.getBulkPhotos = async (idTrx) => {
    let photos = await photoModel.find({ idTrx: idTrx.id });
    return photos;
};
