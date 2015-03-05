Our sweet spot: 80mpbs.

lame -b 80 JLspin01.wav JLspin0111113.mp3

We would save 10kb on a 4 second clip w/ 64.

lame -b 64 JLspin01.wav JLspin0111113.mp3


Bash command:

for f in *.wav; do lame -b 80 "$f" "${f%.wav}.mp3"; done
for f in *.wav; do lame -b 64 "$f" "${f%.wav}.mp3"; done