#!/bin/bash
 
# wget youtube-dl and give him permissions
wget -P ./app https://yt-dl.org/latest/youtube-dl

chmod a+x ./app/youtube-dl

# create temp dir for ffmpeg
mkdir ffmpegtemp

# wget ffmpeg an tar the file
wget -P ./ffmpegtemp https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz

tar xvf ./ffmpegtemp/ffmpeg-git-amd64-static.tar.xz -C ./ffmpegtemp --strip-components=1

# move ffmpeg and ffprobe to the proper place
mv ./ffmpegtemp/ffmpeg ./app && mv ./ffmpegtemp/ffprobe ./app

