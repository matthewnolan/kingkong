/**
 * Created by hayesmaker on 03/02/2015.
 */

module.exports = function(grunt) {

	grunt.registerTask('easel-packer', 'EaselPacking Sprite json..', function() {

		var arr = grunt.file.expand({}, 'src/texturepacker/*.json');
		var filePath, filename;
		var i, len = arr.length, file, animations, key, tempName, animName, count = 0, prevKey, endFrame;
		for (i = 0; i < len; i++) {
			filePath = arr[i];
			grunt.log.write('reading ' + filePath + ' ').ok();

		 	file = grunt.file.readJSON(filePath);
			animations = file['animations'];
			tempName = "";
			count = 0;
			prevKey = "";

			for (key in animations) {
				animName = key.split('__')[0];

				if (tempName !== animName) {
					tempName = animName;

					if (prevKey !== "") {
						if (count > 0) {
							endFrame = animations[prevKey][0] + count;
							animations[prevKey].push(endFrame);
							count = 0;
						}

					}

				} else {
					delete animations[key];
					count++;
				}

				if (animations[key]) {
					prevKey = key;
				}
			}

			//do last item
			if (count > 0) {
				endFrame = animations[prevKey][0] + count;
				animations[prevKey].push(endFrame);
			}


			var splitPath = filePath.split('/');
			filename = splitPath[splitPath.length - 1];

			var name = filename.split('.')[0];

			file['images'] = ['assets/sprites/' + name + '.png'];

			grunt.file.copy('src/texturepacker/' + name + '.png', './public/assets/sprites/' + name + '.png');
			grunt.log.write(name + '.png Exported ' ).ok();

			grunt.file.write('./public/assets/sprites/' + filePath, JSON.stringify(file, null, '\t'));
			grunt.file.copy('./public/assets/sprites/' + filePath, './public/assets/sprites/' + filename);
			grunt.log.write(filename + ' Exported ').ok();
		}

		grunt.file.delete('./public/assets/sprites/src/');
		grunt.log.write('Cleaning and Copying EaselJS Sprite Data ').ok();

	});

};