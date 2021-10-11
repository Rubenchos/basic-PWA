/*
-self => hace referencia al mismo service worker tal cual su palabra en ingles
-addEventListener => Escucha de evento segun paramater ingresado en este caso "fetch" 
                     para el ejercicio esta escuchando cada una de las peticiones que la pagina web que esta haciendo en el momento como los llamados href de los script o el llamado a la imagen etc
*/
self.addEventListener('fetch', event => {
    if (event.request.url.includes('style.css')) {
        // Segun la validacion puedo bloquear la peticion al archivo "Style.css" con la siguiente linea
        //event.respondWith(null); 
        // Para modificar una respuesta de una peticion fetch lo puedo hacer con el siguiente codigo
        let rta = new Response(`
            body {
                background-color: red !important;
                color: blue;
            }
            `, {
            headers: {
                'Content-type': 'text/css'
            }
        });
        //event.respondWith(rta); Linea para ejecutar el codigo anterior;
    }
    else {
        event.respondWith(fetch(event.request));// Linea que me permite ver en el Network que peticiones se realizaron por medio del SW
    }
});

// NOTE : Para manejo de errores sobre una peticion fetch la debo manejar por medio de una promesa que regrese un Response dentro de un if como el siguiente codigo
const resp = fetch('parametro segun EventListener "event.request"')
.then(resp => {
    if(resp.ok) {
        return resp;
    }
    else {
        return fetch('nueva url segun se necesite');
    }
});
