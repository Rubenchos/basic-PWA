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
                '/js/app.js'
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
    const rta = caches.match(event.request)
        .then(res => {
            if (res) { return res }
            return fetch(event.request).then(newResp => {
                caches.open(CACHE_1)
                    .then(cache => {
                        cache.put(event.request, newResp);
                    })
                return newResp.clone();
            })
        })

    event.respondWith(rta)
});

