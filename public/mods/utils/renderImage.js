define([
	'jquery',
	'underscore',
	'Backbone',
	'Marionette',
	'app',
	'./scale',
	'mods/utils/processArray'
], function($, _, Backbone, Marionette, App, scale, processArray){

	//scale, width, height, fits
	return function(opts){
 
		//TEMP CANVAS
		var canvas = document.createElement('canvas');
		var width = opts.width || opts.fits.image.width;
		var height = opts.height || opts.fits.image.height;

		canvas.width = width;
		canvas.height = height;

		var ctx = canvas.getContext('2d');

		var buffer = ctx.createImageData(canvas.width, canvas.height);

		var indexArray = [], i;
		for (i = 0; i < height; i++){
			indexArray[i] = i;
		}

		var ii;
		var invScale = Math.floor(1 / opts.scale);

		function process(index){

			i = index;
			var x = ( i * invScale ) * opts.fits.image.width;

			for(ii=0; ii < width; ii++){
				var y = ii * invScale;
				var pixel = x+y;
				var index = (((height - i) * width) + ii) * 4;
				var value = scale(opts.fits.imageData[pixel], opts.fits);

				buffer.data[index+0] = value;
				buffer.data[index+1] = value;
				buffer.data[index+2] = value;
				buffer.data[index+3] = 255;
			}

		};


		function done(){
			ctx.putImageData(buffer, 0, 0);

			var imgData = canvas.toDataURL();
			var img = new Image();
			img.src = imgData;

			opts.callback(img);
		}

		processArray(indexArray, process, done);

	};

});