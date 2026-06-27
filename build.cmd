@echo off
color 0A
docker build -t registry.ezisolutions.tech/eziops/web-app:v1 .
docker push registry.ezisolutions.tech/eziops/web-app:v1
pause
