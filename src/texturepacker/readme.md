#ImageMagick Commands to convert a spritesheet to multiple frames (used to generate these raw images)
convert d1-sprite22.jpg -crop 116x103 raw/d1-sprite__%03d.png
convert d2-sprite1.jpg -crop 116x103 raw/d2-sprite__%03d.png
convert d3-sprite5.jpg -crop 116x103 raw/d3-sprite__%03d.png
convert d4-sprite.jpg -crop 116x103 raw/d4-sprite__%03d.png
convert m1-sprite.jpg -crop 116x103 raw/m1-sprite__%03d.png

convert f5-sprite2.png -crop 116x103 raw-transparent/f5-sprite__%03d.png
convert f6-sprite2.png -crop 116x103 raw-transparent/f6-sprite__%03d.png
convert f7-sprite2.png -crop 116x103 raw-transparent/f7-sprite__%03d.png

convert Celebration-M1-1.jpg -crop 602x309 raw-celebration/celebration1__%03d.png