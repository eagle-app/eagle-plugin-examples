const fs = require('fs');
const icns = require('./../js/icns-util.js');
const imageSize = require('./../js/image-size.js');

module.exports = async ({ src, dest, item }) => {
    return new Promise(async (resolve, reject) => {
        try {
			// 1. parsing and generate thumbnail file to dest
			await icns.icns2png(src, dest);
			let size = await imageSize(dest);

			// 2. Check if the result is correct
			if (!fs.existsSync(dest) || size.width === 0) {
                return reject(new Error(`icns file thumbnail generate fail.`));
            }

			// 3. update the item dimensions
            item.height = size?.height || item.height;
            item.width = size?.width || item.width;

			// 4. return the result
            return resolve(item);
        }
        catch (err) {
            return reject(err);
        }
    });
}