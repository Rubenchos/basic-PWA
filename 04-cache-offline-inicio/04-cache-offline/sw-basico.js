
self.addEventListener('fetch', event => {
    // Creacion constante en texto plano para manejo de mensaje cuando no existe conexion
    const offlineResp = new Response(`
    Bienvenido a mi Web, no cuentas con conexion a internet,
    intentalo nuevamente`);

    // Creacion constante para inyectar un html
    const offlineRespHtml = new Response(`
    <!Doctype html>
    <html langh="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Mi PWA</title>
    </head>
    <body class="container p-3">
        <h1>
        <div>
            Modo sin conexion
        </div>
        </h1>
    </body>
    </html>
    `,{
        headers:{
            'Content-type':'Text/html'
        }
    });

    // Manejo sin conexion por medio del catch a cualquier peticion simulando la desconexion
    const resp = fetch(event.request)
        .catch(() => offlineResp);

    event.respondWith(resp);
})

