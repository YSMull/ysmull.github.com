#!/bin/bash
printf "\e[1;33m push local change to origin master... \e[0m\n"
git push origin master

printf "\e[1;33m push local change to 腾讯云... \e[0m\n"
ssh -l ubuntu 123.207.108.34 'sh ~/upload.sh'

printf "\e[1;33m push local change to 阿里云... \e[0m\n"
ssh -l maoyusu 120.24.252.243 'sh ~/upload.sh'