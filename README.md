# hayya
A fast config HTTP requests testing tool for busy people 

## For the really busy ones (30 sec running example)
### Installation
```
npm i -g hayya
```

### `hayyarc`
```
$ :3000
/dog
< ok
```

### Run
If you don't have time to run a server listening on `localhost:3000`, run this command in a separate terminal to simulate the server and don't close it:
```
node -e "require('http').createServer((req, res) => { res.end('ok') }).listen(3000)"
```

Now run:
```
hayya
```

