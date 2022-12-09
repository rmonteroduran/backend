# creo server
mongod --bdpath "/Users/rodrigomontero/Library/CloudStorage/GoogleDrive-rodrigomontero89@gmail.com/Mi unidad/Coderhouse/Backend/Desafios/8. MongoDB/DB"

# conecto cliente
mongosh

# creo base de datos ecommerce
use ecommerce

# creo colecciones mensajes y productos
db.createCollection('mensajes')
db.createCollection('productos')

# agrego documentos a mensajes
db.mensajes.insertMany([{autor: "Rodrigo", texto: "hola", fecha: "20/11/2022 15:30:36"},{autor: "Pedro", texto: "buenas tardes", fecha: "20/11/2022 16:30:36"},{autor: "Luis", texto: "Como estan?", fecha: "20/11/2022 17:30:36"},{autor: "Rodrigo", texto: "bien", fecha: "20/11/2022 18:30:36"},{autor: "Pedro", texto: "muy bien!", fecha: "20/11/2022 19:30:36"},{autor: "Luis", texto: "excelente!", fecha: "20/11/2022 20:30:36"},{autor: "paula", texto: "soy nueva en el grupo", fecha: "21/11/2022 11:30:36"},{autor: "Rodrigo", texto: "bienvenida", fecha: "21/11/2022 15:30:36"},{autor: "Pedro", texto: "bienvenida Paula", fecha: "21/11/2022 16:30:36"},{autor: "Luis", texto: "hola! bienvenida!", fecha: "21/11/2022 18:30:36"}])

# agrego documentos a productos
db.productos.insertMany([{title: "agua mineral sin gas", price: 100, thumbnail: "aguasingas"},{title: "agua mineral con gas", price: 100, thumbnail: "aguacongas"},{title: "coca cola", price: 150, thumbnail: "cocacola"},{title: "sprite", price: 150, thumbnail: "sprite"},{title: "fanta", price: 150, thumbnail: "fanta"},{title: "pepsi", price: 150, thumbnail: "pepsi"},{title: "seven up", price: 150, thumbnail: "sevenup"},{title: "paso de los toros", price: 150, thumbnail: "pasodelostoros"},{title: "manaos", price: 110, thumbnail: "manaos"},{title: "prity", price: 120, thumbnail: "prity"}])

# listo documentos
db.mensajes.find()
db.productos.find()

# muestro cantidad de documentos
db.mensajes.countDocuments()
db.productos.countDocuments()

# agrego un documento mas a productos
db.productos.insertOne({title: "quilmes", price: 170, thumbnail: "quilmes"})

# realizo consultas especificas de productos
db.productos.find({"price": {$lt: 100}})
db.productos.find({$and: [{"price": {$lte: 120}},{"price": {$gte: 110}}]})
db.productos.find({"price": {$gt: 120}})
db.productos.find({},{"title":1}).sort({price: 1}).limit(1).skip(2)

# actualizo todos los productos agregando campo stock
db.productos.updateMany({},{$set: {"stock": 100}})

# actualizo stock a 0 de productos con precios menores a 120
db.productos.updateMany({"price": {$lt: 120}},{$set: {"stock": 0}})

# borro productos con precio mayor a 150
db.productos.deleteMany({"price": {$gt: 150}})

# creo usuario pepe con permiso de lectura
use admin
db.createUser({user: "pepe", pwd: "asd456", roles: [{role: "read", db: "ecommerce"}]})

# reconecto server con --auth
mongod --dbpath "/Users/rodrigomontero/Library/CloudStorage/GoogleDrive-rodrigomontero89@gmail.com/Mi unidad/Coderhouse/Backend/Desafios/8. MongoDB/DB" --auth

# conecto cliente con usuario pepe
mongosh -u pepe -p asd456
