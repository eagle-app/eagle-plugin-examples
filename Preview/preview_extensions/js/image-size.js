module.exports = async (filePath) => {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = function () {
            resolve({
                width: img.width,
                height: img.height,
            })
        };
        img.onerror = function (event) {
            resolve({
                width: 0,
                height: 0,
            })
        };
        img.src = require("url").pathToFileURL(filePath).href;
    });
}