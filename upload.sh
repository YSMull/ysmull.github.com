#!/bin/bash
git push origin master
ssh -l ubuntu 123.207.108.34 'sh ~/upload.sh'
ssh -l maoyusu 120.24.252.243 'sh ~/upload.sh'