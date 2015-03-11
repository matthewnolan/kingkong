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