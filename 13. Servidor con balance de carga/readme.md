# primer ejercicio usando cluster

- modo fork
PORT=8081 MODO='fork' npm start

- modo cluster
PORT=8082 MODO='cluster' npm start

- modo fork en puerto 8080 por default
npm start

# segundo ejercicio usando pm2

- inicio server pm2 modo fork
pm2 start src/main.js --name="Server1" --watch -- 8080

- inicio server pm2 modo cluster
pm2 start src/main.js --name="Server1" --watch -i max -- 8081

- listo procesos
pm2 status

- finalizo pm2
pm2 delete all

# tercer ejercicio usando nginx y pm2

- inicio server pm2 modo fork en puerto 8080 para consultar generales
pm2 start src/main.js --name="Server1" --watch -- 8080

- inicio server pm2 modo cluster en puerto 8081 para api/randoms
//pm2 start src/main.js --name="Server2" --watch -i max -- 8081

- inicio nginx
sudo nginx

- detengo nginx
sudo nginx -s stop

- detengo pm2
 pm2 delete all