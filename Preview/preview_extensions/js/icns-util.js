const fs = require('fs');

var OSTYPE = {
    ICON: '32×32',
    'ICN#': '32×32',
    'icm#': '16×12',
    icm4: '16×12',
    icm8: '16×12 ',
    'ics#': '16×16',
    ics4: '16×16',
    ics8: '16×16',
    is32: '16×16',
    s8mk: '16×16',
    icl4: '32×32',
    icl8: '32×32',
    il32: '32×32',
    l8mk: '32×32',
    'ich#': '48×48',
    ich4: '48×48',
    ich8: '48×48',
    ih32: '48×48',
    h8mk: '48×48',
    it32: '128×128',
    t8mk: '128×128',
    icp4: '16x16',
    icp5: '32x32',
    icp6: '64x64',
    ic07: '128x128',
    ic08: '256×256',
    ic09: '512×512',
    ic10: '1024×1024',
    ic11: '16x16@2x',
    ic12: '32x32@2x',
    ic13: '128x128@2x',
    ic14: '256x256@2x ',
};

var Iconutil = (function () {
    function Iconutil(buffer) {
        var header = this.fetchHeader(buffer);
        var pointer = header.data.length;
        var images = [];
        while (pointer < header.bytes) {
            var _a = this.fetchImages(buffer.slice(pointer)), image = _a.image, data = _a.data, osType_1 = _a.osType;
            Buffer.isBuffer(image) &&
                images.push({
                    size: OSTYPE[osType_1],
                    image: image,
                });
            pointer += data.length;
        }
        this.images = images;
    }
    Iconutil.prototype.fetchHeader = function (buffer) {
        var id = buffer.toString('ascii', 0, 4);
        var bytes = buffer.readUInt32BE(4);
        var data = Buffer.alloc(8);
        data.write(id, 0, 4, 'ascii');
        data.writeUInt32BE(bytes, 4);
        return {
            bytes: bytes,
            data: data,
        };
    };
    Iconutil.prototype.fetchImages = function (buffer) {
        var osType = buffer.toString('ascii', 0, 4);
        var bytes = buffer.readUInt32BE(4);
        var image = buffer.slice(8, bytes);
        var _buffer = Buffer.alloc(8);
        _buffer.write(osType, 0, 4, 'ascii');
        _buffer.writeUInt32BE(bytes, 4);
        var data = Buffer.concat([_buffer, image]);
        return {
            data: data,
            image: image,
            osType: osType,
        };
    };
    return Iconutil;
}());

async function icns2png (src, dist) {
	return new Promise(async (resolve, reject) => {
		try {
			let buffer = await fs.promises.readFile(src);
			let images = new Iconutil(buffer).images;
			let max = 0;
			let maxImage;

			images.forEach(function (_a) {
				if (_a && _a.image && _a.image.length > max) {
					max = _a.image.length;
					maxImage = _a.image;
				}
			});

			if (maxImage) {
				await fs.promises.writeFile(dist, maxImage);
				return resolve();
			}

			return reject(new Error(`Can not parse the icns file.`));
		}
		catch (err) {
			return reject(err);
		}
	});
}

async function icns2buffer (src) {
	return new Promise(async (resolve, reject) => {
		try {
			let buffer = await fs.promises.readFile(src);
			let images = new Iconutil(buffer).images;
			let max = 0;
			let maxImage;

			images.forEach(function (_a) {
				if (_a && _a.image && _a.image.length > max) {
					max = _a.image.length;
					maxImage = _a.image;
				}
			});

			if (maxImage) {
				return resolve(maxImage);
			}

			return reject(new Error(`Can not parse the icns file.`));
		}
		catch (err) {
			return reject(err);
		}
	});
}

module.exports = {
	icns2png: icns2png,
	icns2buffer: icns2buffer
};
