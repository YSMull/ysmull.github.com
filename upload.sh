#!/bin/bash
printf "\e[1;33m push local change to 阿里云... \e[0m\n"
ssh -l maoyusu 120.24.252.243 'sh ~/upload.sh'
