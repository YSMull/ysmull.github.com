#!/bin/bash
echo -e "\e[1;31mpush local change to origin master..."
echo -e "\e[1;31m-------------------------------------"
git push origin master

echo -e "\e[1;31mpush local change to 腾讯云..."
echo -e "\e[1;31m-------------------------------------"
ssh -l ubuntu 123.207.108.34 'sh ~/upload.sh'

echo -e "\e[1;31mpush local change to 阿里云..."
echo -e "\e[1;31m-------------------------------------"
ssh -l maoyusu 120.24.252.243 'sh ~/upload.sh'