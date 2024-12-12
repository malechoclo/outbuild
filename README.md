# Outbuild technical challenge

## Prepare the environmet
```
cd ui && npm i --force && cd ..;
cd api && npm i --force && cd ..;
```
## STEPS TO RUN:
### RUN API
#### open new terminal
```bash
cd api
npm start
```
### If all goes well, you will see the following message. You can now access the application in as many browsers as you wish
```bash
> outbuild-api@1.0.0 start
> node server.js

Server running on http://localhost:5001
```
### RUN UI
#### open new terminal

```bash
cd ui
npm start
```
### If all goes well, you will see the following message. You can now access the application in as many browsers as you wish

```bash
Compiled successfully!

You can now view outbuild-ui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.92:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```
## IMPORTANT : you need to have api and ui running before running the tests.
### RUN TEST
#### open new terminal
```bash
cd ui
npm test a
```

# Known errors:

## Known errors:
### When a task is edited or moved, it changes its appearance for all clients, including the one editing it. 

#### Author web:  https://cristiandonososilva.cl