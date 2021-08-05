import * as sharp from 'sharp';

export var transformFormatImg = sharp().jpeg();

export var transformImgSize = sharp().resize(200).jpeg({ quality: 100 });
