lame -b 80 JLspin01.wav JLspin0111113.mp3

We would save 10kb on a 4 second clip w/ 64.

lame -b 64 JLspin01.wav JLspin0111113.mp3


Bash command:

for f in *.wav; do lame -b 80 "$f" "${f%.wav}.mp3"; done
for f in *.wav; do lame -b 64 "$f" "${f%.wav}.mp3"; done



for converting video

ffmpeg -i B1Intro.avi B1Intro_%04d.png

skip evey other frame
ffmpeg -i B1Intro.avi -filter:v select="not(mod(n-1\,2))",setpts="N/(25*TB)" B1Intro_%04d.png



ffmpeg -i WWIntro.avi -filter:v select="not(mod(n-1\,2))",setpts="N/(25*TB)" -vf scale=116:103 WWIntro_%04d.png
ffmpeg -i WWIntro.avi -r 12 -vf scale=116:103 WWWIntro_%04d.png

ffmpeg -i WWIntro.avi -r 12 -vf WWWWIntro_%04d.png

ffmpeg -i WWIntro.avi -r 12 -filter:v scale=116:-1 WWWWIntro_%04d.png
ffmpeg -i WWIntro.avi -r 12 WWWWWIntro_%04d.png

 ffmpeg -i $f -r 12 -filter:v scale=116:-1 ${f%.*}_%04d.png



no good. not better than ffmped
convert %1 -filter Lanczos -sampling-factor 1x1 -quality 90 -resize 116
convert WWWWWIntro_0001.png -filter Lanczos -sampling-factor 1x1 -resize 116 WWWWW----Intro_0001.png



for f in *.avi
do
 ffmpeg -i $f -r 9 -filter:v scale=116:-1 ${f%.*}__%03d.png
 # echo "Processing $f"
 # echo "filename: ${f%.*}"
 # do something on $f
done