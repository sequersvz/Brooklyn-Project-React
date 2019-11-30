- npm install
- npm run cy:open


#test with docker

- run docker container

`docker run -it --volume=$PWD:/localDebugRepo --workdir="/localDebugRepo" --memory=4g --memory-swap=4g --memory-swappiness=0 --entrypoint=/bin/bash cypress/base:10`

- npm run cy:run --browser chrome

