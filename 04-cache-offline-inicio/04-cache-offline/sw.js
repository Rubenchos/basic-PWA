const CACHE_1 = 'cache-1'

/* APP SHELL => lo que la app necesita para que funcione 
(sirve para que la pp cargue rapidamente teniendo en cuenta el cache )*/

self.addEventListener('install', event => {
    const cacheInstall = caches.open(CACHE_1)
        .then(cache => {
            // Metodo para guardar varios archivos en el cache
            return cache.addAll([
                '/',//pleca importante para trabajar en el entorno localhost:puerto/ruta
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
                '/js/app.js',
                '/image/no-image.jpg'
            ])
        })

    event.waitUntil(cacheInstall);
});

/* Estrategias de cache se suelen realizar desde el evento fetch
por ejemplo la estrategia cahce only sirve para que la app no tenga necesidad de buscar 
recursos que pueden tardar en cargar, accedemos directamente al cache*/

self.addEventListener('fetch', event => {

    /*1-Estrategia cache only -> estrategia que tiene el defecto de que si no esta actualizado los archivos
    en el cache puede reventar debido a que el modo offline cargara unicamente lo que este guardado en el cache
    - Esta estrategia aplicada con el caches.match valida que existan todas las peticiones de archivos
    externos en el cache para que se carguen en modo offline
    */
    //event.respondWith(caches.match(event.request))

    /* 2- Estrategia Cache with network Fallback then cache, este proceso sirve para buscar archivos que no esten
    en el cache y tomarlos de la web y asi mismo guardarlo en el cache por si se necesita en un futuro,
    tiene el inconveniente de que se mezcla el cache del cascaron con recursos dinamicos*/

    // const rta = caches.match(event.request)
    //     .then(res => {
    //         if (res) { return res }
    //         return fetch(event.request).then(newResp => {
    //             caches.open(CACHE_1)
    //                 .then(cache => {
    //                     cache.put(event.request, newResp);
    //                 })
    //             return newResp.clone();
    //         })
    //     })

    // event.respondWith(rta)

    /*3- Estrategia Network with chache fallback, esta estrategia es cuando primero se consulta en la web y si esta no responde se busca
    dentro de la cache que guardada, tiene el inconveniente de que de igual manera siempre se esta dando peticion a la web por lo que
    no va a ofrecer una baja en el performance en un modo offline*/

    // const rta = fetch(event.request)
    //     .then(res => {
    //         if (!res) return caches.match(event.request);

    //         caches.open(CACHE_1)
    //             .then(cache => {
    //                 cache.put(event.request, res);

    //             })
    //     });

    // event.respondWith(rta)

    /*4- Estrategia Cache with network update, esta estrategia sirve para cuando el performance de la applicacion es critico
    esta estrategia se encarga de realizar actualizaciones para que el usuario sienta que, se parte de que todo ya existe en el cache no
    obtendre nada dinamico osea peticion a la web, tiene el inconveniente de que el cache siempre estara una version atras, 
    ejemplo: actualizar algo en el html no se vera en pantalla hasta que recargue el navegador por segunda vez pues el cache se actualizo
    hasta despues de que  renderizo el cache previo a su actualizacion

     */

    // const respuesta = caches.open(CACHE_1).then(cache => {
    //     fetch(event.request).then(newRes => {
    //         cache.put(event.request, newRes);
    //         return cache.match(event.request);
    //     })
    // });

    // event.responseWith(respuesta);

    /* 5- Estrategia cache network race, estrategia para identificar que recurso esta disponible primero si 
    la web o el cache asi el usuario tendra la rta de la manera mas rapida posible    
    */

    const respuesta = new Promise((resolve, reject) => {
        let rechazada = false;
        const fallaUnaVez = () => {
            if (rechazada) {
                if (/\.(png\jpg)/i.test(event.request.url)) {
                    resolve(caches.match('/img/no-image.jpg'))
                }
                else {
                    reject('no se encontro nada');
                }
            }
            else {
                rechazada = true
            }
        }
        fetch(event.request).then(res => {
            res.ok ? resolve(res) : fallaUnaVez();
        }).catch(fallaUnaVez);

        caches.match(event.request).then(res => {
            res ? resolve(res) : fallaUnaVez();
        }).catch(fallaUnaVez);
    })

});

