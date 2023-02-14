# prof

###### `node --prof src/main.js`
###### `--prof-process isolate-0x140008000-4785-v8.log` 
###### `--prof-process isolate-0x130008000-4886-v8.log`

# artillery test

###### `artillery quick --count 50 -n 40 http://localhost:8080/info > result_fork.txt`

- Ejecutando la prueba sobre la ruta /info se obtiene un tiempo de respuesta medio de 63.4 ms.
- - min: 4
- - max: 120
- - median: 63.4

###### `artillery quick --count 50 -n 40 http://localhost:8080/info > result_fork_consolelog.txt`

- Imprimiendo por consola la información de la ruta aumenta un %49,21 el tiempo de respuesta medio.
- - min: 5
- - max: 168
- - median: 94.6
