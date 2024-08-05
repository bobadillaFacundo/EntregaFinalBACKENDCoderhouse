En el siguiente video se ve:
  Cargar Producto<br>
  Modificar Producto<br>
  Buscar por status y categoria<br>
  Buscar producto <br>
  Eliminar producto<br>
  Uso de Paginacion<br>
  Crear carrito<br>
  Cargar carrito<br>
  Buscar carrito y uso de populate<br>
  Eliminar carrito<br>
  Eliminar producto de carrito<br>

https://drive.google.com/file/d/1jXGwxF_yMIH17aXVkjb0qcbvSdsqTPBG/view?usp=sharing

Las tecnologias que se usaron para el fron son html,css,js y handlebars, para el back node.js y mongo como persistencia. 

Preparación de la aplicación:

Asegúrate de tener de clonar este directorio en tu maquina local

Construcción de la imagen Docker:

Desde la línea de comandos, en el directorio donde se encuentra tu Docker-Compose, ejecuta el siguiente comando para construir la imagen Docker-compose:

          docker-compose build
Ejecución del contenedor:

Una vez que la imagen se haya construido correctamente, puedes ejecutar un contenedor con el siguiente comando

          docker-compose up
Despues habrir en el puerto [http://localhost:8080/api/products/principal](http://localhost:8080/api/products/principal) 

Los datos se persisten en la bdd MongoDB



