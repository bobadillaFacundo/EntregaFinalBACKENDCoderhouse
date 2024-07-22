
La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior

![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/d6cc56f0-96fa-4d71-9073-0c21d22bdc8b)


La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/0aef7ebd-5921-4f13-873f-64961ce0c39d)


La ruta raíz POST / deberá agregar un nuevo producto con los campos:
id: Number/String (A tu elección, el id NO se manda desde body, se autogenera como lo hemos visto desde los primeros entregables, asegurando que NUNCA se repetirán los ids en el archivo.
title:String,
description:String
code:String
price:Number
status:Boolean
stock:Number
category:String
thumbnails:Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
Status es true por defecto.
Todos los campos son obligatorios, a excepción de thumbnails
![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/be9f71b5-ec10-42eb-aa1b-2fa14539d0f6)

![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/72ca7482-966e-491b-8cf0-e1b8186fabfa)

La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/6781cbc9-cecd-46fc-a600-9240eb1bc90e)
![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/8bbd57d6-b95e-47e9-abdc-1adc3f3320e6)

La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 

![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/9c22f4de-2c50-4e1b-b045-e15fe55dbd44)
![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/310aa195-a678-44f2-8d12-e2d3b0de9cbb)


La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto

![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/3753c1f5-a8e9-433d-82fb-39fa20ab2635)

La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/1be5a68a-366a-4b45-a623-664d13f191f5)



La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 


![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/eb0dce74-0191-4588-b7ac-154f09ba1a0f)
![image](https://github.com/bobadillaFacundo/coderhouse/assets/57062710/e13f9b41-2fa3-47f2-90fc-25d610bddd34)













