# Tutorial D3.js

## Mini Repaso de Programación Web

![web_history](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Webdevelopmenttimeline.png/722px-Webdevelopmenttimeline.png)

Una página web se estructura:

1. Contenido: Hipertexto en **HTML**
2. Estilo: Definido en cascada usando el lenguaje **CSS**
3. Funcionalidad: Implementando funciones en **JavaScript**

Páginas útiles:

- [Página de JavaScript](https://www.javascript.com/)

- [W3Schools](https://www.w3schools.com/js/)

## D3: Data-Driven Documents

### Páginas útiles

- [Main Page](https://d3js.org/)
- [Git](https://github.com/d3/d3)
- [Latest Release](https://github.com/d3/d3/releases/download/v6.7.0/d3.zip): Versión mínima se encuentra adjunta en Material Docente
- [Gallery](https://observablehq.com/@d3/gallery)
- [Tutorials](https://github.com/d3/d3/wiki/Tutorials)

### Cómo vamos a trabajar con d3.js

Para comenzar a trabajar debes seguir los siguiente pasos:

1. En una consola lanzar un servidor desde la ubicación de nuestra carpeta de trabajo (donde están los archivos de este tutorial) de esta forma:

   ```bash
   python -m http.server 8080 		# Python 3.x
   python -m SimpleHTTPServer 8080	# Python 2.7.x
   ```

   Esto tiene como finalidad servir en forma local el archivo de datos y la librería (y cualquier otro archivo que necesitemos utilizar).

2. Abre tu navegador web favorito y dirígete a [`http://localhost:8080/exploring_d3.html`](http://localhost:8080/exploring_d3.html) (se debería ver una página en blanco).

3. Cada vez que hagas alguna modificación al código debes refrescar la página para ver los cambios.

## DOM Elements  (Document Object Model)

Estándar para representar un documento HTML, XML o XHTML.

Los documentos HTML consisten básicamente de dos elementos principales: `<head>` y `<body>`.

Dentro de `<head>` define la cabecera del documento. Allí se declaran las librerías, scripts (`<script>`), hojas de estilo CSS (`<style>`) y otros meta-datos (`<title>`, `<meta>`, etc). El contenido dentro de esta etiqueta no se muestra al usuario.

El `<body>` es el cuerpo del documento y contiene los objetos que estructuran su contenido:

- `<p>` para párrafos
- `<label>` para texto
- `<a>` para hipervínculos
- `<div>` para divisiones dentro de la página
- etc...

Ejemplo: `<div id="myDiv" class="container"> ... </div>` es un objeto de tipo `div` y con atributos `id` y `class`.

[`ejemplo`](http://localhost:8080/html_example.html)

## SVG: Scalable Vector Graphics

Formato de gráficos vectoriales bidimensionales. Ampliamente soportado por navegadores.

```html
<div id="chart">
    <svg width="200" height="200">
    	<circle cx="50" cy="100" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>
</div>
```

[`ejemplo`](http://localhost:8080/svg_example.html)

## Primeros pasos en D3

### Importar D3

Dentro de  `<head>` donde se define el `<script>` importamos la librería D3.js, esto se puede hacer en referencia a un archivo local `d3.js` o directamente a la fuente:

````html
<head>
    // Local
    <script src="d3.min.js" charset="utf-8"></script>
    // Web
    <script src="https://d3js.org/d3.v6.min.js"></script>
</head>
````

Para esto vamos a insertar el código javascript dentro de la etiqueta `<script type="text/javascript"> ... </script>` del archivo [`exploring_d3.html`](http://localhost:8080/exploring_d3.html)

### Select

En el archivo `exploring_d3.html` tenemos lo básico de un archivo `html`. Ahora, comenzaremos a utilizar D3 como una librería en javascript. Dentro del cuerpo (`<body>`) solo tenemos un objeto:

````html
<body>
    <div id="someDiv" class="container"></div>
</body>
````

Se puede acceder a este objeto de tres manera

1. Por tipo: `d3.select("div")` 
2. Por id: `d3.select("#someDiv")`	
3. Por clase: `d3.select(".container")`

Dentro de tu navegador de preferencia, accederemos a la consola. Dependiendo del navegador hay diversas maneras de acceder, puedes revisar la que corresponda [aquí](https://balsamiq.com/support/faqs/browserconsole/).

Abre la consola con el archivo [`exploring_d3.html`](http://localhost:8080/exploring_d3.html) abierto y escribe el siguiente comando:

````javascript
d3.select("#someDiv").style("background", "red").html("Here some content")
````

Para crear nuevo contenido usamos la función `html`. En esta parte si no insertamos nuevo contenido no veremos ningún cambio, ya que un div vacío no ocupa espacio.

Recarga la página y esta vez colorearemos el *background* sin agregar nuevo contenido. En la consola inserta:

````javascript
d3.select("#someDiv").style("background", "red").style("width", "200px").style("height", "100px")
````

### Comenzar un svg

Recarga la página nuevamente y comenzaremos haciendo un círculo en formato `SVG`. Primero debemos seleccionar nuestro `div` y crear un SVG en él (todo desde consola):

```javascript
canvas = d3.select("#someDiv") // Retorna el DIV con id="chart" 
    .append("svg") // Adjunta un elemento de tipo SVG y lo retorna
    .attr("width", 700) // Seteamos el ancho a 200px 
    .attr("height", 400) // Seteamos el alto a 200px
```

Luego, crear un círculo:

```javascript
circle = canvas.append("circle") // Adjuntamos un elemento circle al SVG
    .attr("cx", 50) // Posicionamos el elemento en (50,50)
    .attr("cy", 50)
    .attr("r", 40) // Radio 40 px
    .style("fill", "pink") // Color de fondo rosado
    .style("stroke", "green") // Color del borde verde
    .style("stroke-width", 5) // Grosor del borde 5px
```

Deberíamos ver un círculo con las características que le dimos: color rosado y línea verde.

Ahora, asociaremos datos a estos archivos svg. Recarga la página y esta vez crearemos más de un círculo.

```javascript
canvas = d3.select("#someDiv") // Retorna el DIV con id="chart" 
    .append("svg") // Adjunta un elemento de tipo SVG y lo retorna
    .attr("width", 700) // Seteamos el ancho a 200px 
    .attr("height", 400) // Seteamos el alto a 200px

my_data = [1, 2, 3, 4, 5]; // nuestros primeros datos en D3

circles = svg.selectAll("circle")
    .data(my_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return 80 * d
    }) // Lo único que depende de nuestros datos es el centro del círculo
    .attr("cy", 40)
    .attr("r", 30)
    .style("fill", "pink")
    .style("stroke", "green")
    .style("stroke-width", 5);
```

*Nota*: Cuando la data ha sido asociada a los elementos, no es necesario volver a asociarlos (con el operador `data`). D3 va a usar la data ligada anteriormente. Se puede entonces recomputar las propiedades sin tener que entregar los datos nuevamente

### Asociación entre DOM y datos

**D3 enlaza datos a elementos del DOM**. Al asociar existen 3 posibilidades:

1. La cantidad de datos **=** cantidad de elementos (**`update`**)
2. La cantidad de datos **>** cantidad de elementos (**`enter`**)
3. La cantidad de datos **<** cantidad de elementos (**`exit`**)

- **`enter`**: entrega todos los nodos nuevos, que están entrando a la selección
- **`exit`** : entrega todos los nodos que se van
- **`update`**: actualizar los nodos con los datos asociados

Para este ejemplo usaremos siempre las siguientes variables:

````javascript
var svg = d3.select("body")
    .append("svg")
    .attr("width", 700)
    .attr("height", 700);
var datos;
````

Para ahorrar tiempo, agrega esto al archivo `exploring_d3.html` en la sección de scripts:

````html
<body>
    ...
    <script>
        var svg = d3.select("body")
            .append("svg")
            .attr("width", 700)
            .attr("height", 700);
        var datos;
    </script>
</body>
````

#### `enter`

Una vez agregado el script de arriba, recarga la página y ejecuta desde consola:

````javascript
// Cantidad de datos = 2
datos = [10, 20];

// Cantidad de DOM elements = 0
canvas.selectAll("circle")        // 1. Seleccionamos todos los circulos existentes: ninguno
    .data(datos)            // 2. Asociamos los datos a los circulos seleccionados: 
    //    ningún dato fue asociado ya que no hay circulos
    .enter()                // 3. Seleccionamos todos los datos que no han sido 
    // asociados a algun elemento: los dos datos ([10,20])
    .append("circle")    // 4. Les asociamos un elementos de tipo círculo con los 
    //    los siguientes atributos:
    .attr("cx", function (d) {
        return d * 10;
    })
    .attr("cy", 100)
    .attr("r", function (d) {
        return d;
    })
    .attr("fill", "green");
````

Fijarse que esta vez las diferencias son en la posición en el eje **x** y en el tamaño del círculo (radio).

Esta vez sí tendremos círculos existentes. Recarga la página y ejecuta en la consola:

````javascript
// Cantidad de datos = 2
datos = [10, 20];


// Cantidad de DOM elements = 1 
circle1 = canvas.append("circle")
    .attr("cx", 50)
    .attr("cy", 50)
    .attr("r", 5);

canvas.selectAll("circle")     // 1. Seleccionamos todos los círculos existentes: circle1      
    .data(datos)            // 2. Asociamos los datos a los círculos seleccionados: 
    //    circle1 <-> 10 (datos[0])
    .enter()                // 3. Seleccionamos todos los datos que NO fueron asociados 
    //    anteriormente: 20 (datos[1])
    .append("circle")   // 4. Los atributos del nuevo círculo están asociados a datos[1]
    .attr("cx", function (d) {
        return d * 10;
    })  // cx = datos[1]*10 = 20*10 = 200                     
    .attr("cy", 100)                          // cy = 100   
    .attr("r", function (d) {
        return d;
    })     // r = datos[1] = 20
    .attr("fill", "green");                   // coloreamos verde   
````

#### `update`

Recargamos la página una vez más y ejecutamos el siguiente código para notar la diferencia entre `enter` y `update`:

````javascript
// Cantidad de datos = 2
datos = [10, 20];

// Cantidad de DOM elements = 2 
circle1 = canvas.append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 5);

circle2 = canvas.append("circle")
    .attr("cx", 150)
    .attr("cy", 100)
    .attr("r", 10);

// UPDATE 
canvas.selectAll("circle")      // 1. Seleccionamos todos los círculos existentes: circle1      
    .data(datos)            // 2. Asociamos los datos a los círculos seleccionados: 
    //    circle1 <-> 10 (datos[0]), circle2 <-> 20 (datos[1])
    // 3. Todas las modificaciones de atributos se aplican
    //    en los elementos asociados: circle1 y  circle2
    //    Es decir, estamos actualizando atriburos de los elementos     
    .join() // reemplazar con enter para notar la diferencia
    .attr("cx", function (d) {
        return d * 10;
    })
    .attr("cy", 100)
    .attr("r", function (d) {
        return d;
    })
    .attr("fill", "green");
````

> En versiones anteriores esta era la función `update`, en las versiones actuales esto se hace mediante `join`, sin embargo, `join` realiza la operación `enter` y `update` al mismo tiempo. Para tratarlas por separado se debe definir que hacer con cada una, como sigue:
>
> ````javascript
> .join(
>        enter => enter.some_function(),
>        update => update.some_function()
> )
> ````
>
> Por lo que el código anterior, para que solo funcione con los círculos existentes debe ser:
> 
> ````javascript
> .join(
>        enter => enter,
>        update => update.attr("cx", function(d){ return d*10; })
> )
>        .attr("cy", 100)
>        .attr("r",  function(d){ return d; })
>        .attr("fill", "green");
> ````
> 
> *Propuesto*: Crear 3 datos y probar qué pasa con dos círculos pre-existentes.

#### `exit`

Recargamos la página y ejecutamos el siguiente código para la función `exit`:

````javascript
// Cantidad de datos = 1
datos = [10];

// Cantidad de DOM elements = 2 
var circle1 = canvas.append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 5);

var circle2 = canvas.append("circle")
    .attr("cx", 150)
    .attr("cy", 100)
    .attr("r", 10);

canvas.selectAll("circle")     // 1. Seleccionamos todos los círculos existentes: 
    //    circle1 y circle2     
    .data(datos)            // 2. Asociamos los datos a los círculos seleccionados: 
    //    circle1 <-> 10 (datos[0])
    .exit()                 // 3. exit() entrega todos los elementos que no fueron 
    //     asociados anteriormente: circle2
    .remove()               // 4. Podemos cambiar sus atributos si queremos, o bien,
                            //    podemos quitarlo a través del método: remove()
````

## ¡Por fin! Datos

De aquí en más trabajaremos con nuestro propio archivo `index.html` (no incluido en los archivos del tutorial). Para crearlo, desde cualquier editor de texto ingresen el siguiente código:

````html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Tutorial D3</title>
        <script src="d3.min.js" charset="utf-8"></script>
    </head>
    <body>
        <div id="chart" class="clase1" style="width:550px;height:350px;border:black 1px solid;"></div>
        <script type="text/javascript">
            // Acá iremos escribiendo código
        </script>
    </body>
</html>
````

Guardar con el nombre `index.html` en nuestra carpeta de trabajo y abrirlo dirigiéndose a [`http://localhost:8080/`](http://localhost:8080/).

Ocuparemos el archivo `test_data.csv` con cuatro columnas (3 ordinal y 1 nominal categórica) y 8 registros:

| v1   | v2   | v3   | v4   |
| ---- | ---- | ---- | ---- |
| 40   | 40   | 30   | "A"  |
| 150  | 70   | 10   | "B"  |
| 20   | 25   | 27   | "B"  |
| 100  | 10   | 32   | "C"  |
| 120  | 15   | 20   | "A"  |
| 110  | 20   | 10   | "C"  |
| 98   | 60   | 40   | "C"  |
| 30   | 45   | 38   | "C"  |

Comencemos leyendo los datos. Abrimos la consola y ejecutamos:

```` javascript
d3.csv("test_data.csv").then(function(d) {
    console.log(d)
});
````

Que devuelve:

````javascript
Promise { <state>: "pending" }
Array(8) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…} ]
````

> La función `csv` (y todas las funciones de lectura de datos en D3) generan una `Promise`. Esto es un objeto **asíncrono** que funciona como un *"delegado"* (o `proxy`) de un objeto desconocido que se ejecutará en algún momento futuro. Esto no debe preocupar, si se trabaja con archivos locales.

Si se requiere cargar los datos uno a uno en lugar de como un `array`:

````javascript
d3.csv("test_data.csv", function(d){
    console.log(d)
});
````

En la consola veremos los datos uno a uno (fila a fila):

````javascript
Promise { <state>: "pending" }
Object { v1: "40", v2: "40", v3: "30", v4: "A" }
Object { v1: "150", v2: "70", v3: "10", v4: "B" }
...
````

Como se ve en el output (o salida), todo dato cargado usando `d3.csv` es un string, por lo que debe ser *"casteado"* (`cast`) a un número (entero o flotante, decimal). Esto se puede hacer como sigue:

```javascript
d3.csv("test_data.csv").then(function(data) {
    // Casting de String -> Number
    data.forEach(function(d){
        d.v1 = +d.v1;
        d.v2 = +d.v2;
        d.v3 = +d.v3;
    });
    console.log(data);
})
```
Esta vez en la consola vemos:

````javascript
Promise { <state>: "pending" }

Array(8) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…} ]
0: Object { v1: 40, v2: 40, v3: 30, … }
1: Object { v1: 150, v2: 70, v3: 10, … }
...
````

Teniendo los datos como números.

Comencemos a graficar nuestros datos. 

````javascript
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", "400px")
    .attr("height", "250px");
````

````javascript
var datos;
````

````javascript
d3.csv("test_data.csv").then(function(data) {
    // Casting de String -> Number
    data.forEach(function(d){
        d.v1 = +d.v1;
        d.v2 = +d.v2;
        d.v3 = +d.v3;
    });
    datos = data;
});
````

````javascript
canvas.selectAll("circle")
    .data(datos)
    .enter() // Enter ;)
    .append("circle")
    // Posición en x es v1
    .attr("cx", function (d) {
        return d.v1 * 2
    })
    // Posición en y es v2
    .attr("cy", function (d) {
        return d.v2 * 2
    })
    // Radio (o tamaño) es v3
    .attr("r", function (d) {
        return d.v3
    })
    .style("fill", "green")
    .style("stroke", "black")
    .style("stroke-width", 5);
````

¿Muy desordenado? Vamos a ordenar el gráfico un poco y agregaremos ejes, márgenes y colores diferentes.

## Elementos de un gráfico en D3

Hay varias variables que definir antes de continuar. Primero definamos las variables en la sección `<script>` de nuestro archivo `html`:

````html
<script>
    var margin = {
        top: 20,
        right: 10,
        bottom: 20,
        left: 50
    };
    var width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
</script>
````

> Hasta acá puedes re-hacer la parte anterior (eliminando la asignación a `svg`) y ver como se ordena un poco la figura.

Seguiremos usando los mismos datos y de la misma forma, así que los incluimos al `script` :

````html
<script>
    var datos;
    ...
</script>
````

Acá es importante notar que como `d3.csv` es asíncrono, lo seguiremos usando desde consola. Para ahorrar tiempo, definiremos el importe de los datos y el gráfico como funciones:

````html
<script>
    var datos;
    var svg;
    function importData(){
        d3.csv("test_data.csv").then(function(data) {
                // Casting de String -> Number
                data.forEach(function(d){
                    d.v1 = +d.v1;
                    d.v2 = +d.v2;
                    d.v3 = +d.v3;
                });
                datos = data;
            });
    }
    function firstSteps(aSvg){
        aSvg.selectAll("circle")
            .data(datos)
            .enter() // Enter ;)
            .append("circle")
            // Posición en x es v1
            .attr("cx", function(d) { return d.v1 * 2 })
            // Posición en y es v2
            .attr("cy", function(d) { return d.v2 * 2 })
            // Radio (o tamaño) es v3
            .attr("r", function(d) { return d.v3 })
            .style("fill", "green")
            .style("stroke", "black")
            .style("stroke-width", 5);
    }
    ...
</script>
````

Cambiemos el color para ver que aun podemos alterar el gráfico. En la consola:

````javascript
importData(); // Acá, presionar enter, ya que este es el paso asíncrono
firstSteps(canvas);
canvas.selectAll("circle").style("fill", "red");
````

### Paleta de Color

Agregar color:

```javascript
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Para aplicar el color:
canvas.selectAll("circle")
    .data(datos)
    .join()
    .style("fill", function (d) {
        return color(d.v4)
    })
```
Hasta ahora tenemos los datos con colores. Puedes ir pasando el código ejecutado al archivo `index.html` o no recargar la página.

### Eje **x**

Estandarizar el eje x:

```javascript 
var x = d3.scaleLinear()
    .domain([0, d3.max(datos, function(d) {
        return +d.v1
    })])
   .range([0, width]);

var xAxis = d3.axisBottom().scale(x);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Para aplicar la escala en el atributo de posición de un elemento
svg.selectAll("circle")
    .data(datos)
    .join()
        .attr("cx", function(d) { return x(d.v1) })
```

### Eje **y**

Estandarizar el eje y:

```javascript
var y = d3.scaleLinear()
    .domain([0, d3.max(datos, function (d) {
        return +d.v2
    })])
    .range([height, 0]);

var yAxis = d3.axisLeft().scale(y);

canvas.append("g")
    .call(yAxis);

// Para aplicar la escala en el atributo de posición de un elemento
canvas.selectAll("circle")
    .data(datos)
    .join()
    .attr("cy", function (d) {
        return y(d.v2)
    });
```

### Leyenda

Agregar leyenda:

```javascript
var leyenda = canvas.selectAll(".leyenda")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "leyenda")
    .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
    });

leyenda.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);
ss

leyenda.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
        return d;
    });
```

Agregar todo al código `index.html`. Muchas de ellas dependen de la `data`, por la que debes agregar todo a la función `firstSteps`. Puedes editar la función para que las partes al alterar el `svg` quede toda junta.

> Hay varias cosas que no son directas de cambiar, dada la naturaleza asíncrona de `d3.csv()` y la forma en que se edita el archivo `svg`. Para chequear como debería ser el archivo `index.html` hasta este paso revisa el archivo [`spoiler1.html`](http://localhost:8080/spoiler1.html)

Recargar la página y llamar los dos métodos (en consola):

````javascript
importData(); // Enter antes de ejecutar la siguiente línea
firstSteps(canvas);
````

Para agregar tooltips, debemos definir **eventos** en `index.html` dentro del *tag* `<style>` en el `<header>`:

````html
<header>
    <style type="text/css">
        .tooltip {
            position: absolute;
            width: 50px;
            height: 25px;
            pointer-events: none;
            background-color: #fff;
        }
    </style>
</header>
````

Agregar tooltip interactivo.

```javascript
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

canvas.selectAll("circle")
    .data(datos)
    .join().on("mouseover", function (event, d) {
    tooltip.html("v4 = " + d.v4)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px")
        .style("opacity", 1)
}).on("mouseout", function (d) {
    tooltip.style("opacity", 0)
});
```

## Todo en un solo archivo

Para que todo quede en un solo archivo y dejemos de utilizar la consola, todo debe quedar definido dentro del *scope* de `d3.csv`. Realizar los cambios y recargar la página.

> El resultado final está en el archivo [`spoiler2.html`](http://localhost:8080/spoiler2.html)

## Propuesto

Realiza un gráfico en **D3.js**. Puedes preguntar o *googlear* todas las funciones que se necesiten.

Considera que lo que sigue es utilizar *templates* de gráficos pre-hechos mediante [Observable](https://observablehq.com/tutorials)

----

Este documento fue inicialmente escrito por Vanessa Araya (http://vpena.me/), actualizado y aumentado por Pablo Estefó (https://pestefo.github.io/) en Mayo 2018 y en mayo de 2021 por Juan Saez (https://starbrand.github.io/).

