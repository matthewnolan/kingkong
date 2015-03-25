/**
 * Created by andy hayes on 03/02/2015.
 */

module.exports = function(grunt) {

	grunt.registerTask('temp-copy', 'Copying Game.js for temp version', function() {
		grunt.file.copy('public/javascripts/app/core/Game.js', '.temp/Game.js');
	});

	grunt.registerTask('temp-copy-return', 'Returning Game.js from temp location', function() {
		grunt.file.copy('.temp/Game.js', 'public/javascripts/app/core/Game.js');
		grunt.file.delete('.temp/');
	});

	grunt.registerTask('copy-prod-index', 'Copying html template for minified js (index.html)', function() {
		grunt.file.copy('src/html-templates/index-prod.html', 'public/index.html');
	});

	grunt.registerTask('copy-dev-index', 'Copying html template for un-concatenated development files (index.html)', function() {
		grunt.file.copy('src/html-templates/index-dev.html', 'public/index.html');
	});

	grunt.registerTask('easel-packer', 'EaselPacking spritesheet json like a boss...', function() {

		var arr = grunt.file.expand({}, 'src/texturepacker/*.json');
		var filePath, filename;
		var i, len = arr.length, file, animations, key, tempName, animName, count = 0, prevKey, endFrame, shortFrameEnd, startFrame;
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
							startFrame = animations[prevKey][0];
							endFrame = startFrame + count;
							shortFrameEnd = startFrame + 10;

							delete animations[prevKey];

							animations[prevKey.toLowerCase()] = [
								startFrame,
								endFrame,
								0,
								0.5
							];

							animations[prevKey.toLowerCase() + '_short'] = [
								startFrame,
								shortFrameEnd,
								0,
								0.5
							];

							animations[prevKey.toLowerCase() + '_resume'] = [
								shortFrameEnd,
								endFrame,
								0,
								0.5
							];

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
				startFrame = animations[prevKey][0];
				endFrame = startFrame + count;
				shortFrameEnd = startFrame + 10;

				delete animations[prevKey];

				animations[prevKey.toLowerCase()] = [
					startFrame,
					endFrame,
					0,
					0.5
				];

				animations[prevKey.toLowerCase() + '_short'] = [
					startFrame,
					shortFrameEnd,
					0,
					0.5
				];

				animations[prevKey.toLowerCase() + '_resume'] = [
					shortFrameEnd,
					endFrame,
					0,
					0.5
				];
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