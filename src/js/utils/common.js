// use common.js for functions that need to be executed on page load

// performs feature query for navigator, then initialises service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(() => {
            // console.log('ServiceWorker registration successful with scope: ', registration.scope);
            // note: if storage was NOT cleared (or caching=false), service worker install event wont be triggered
        }, (err) => {
            // registration failed
            console.log('ServiceWorker registration failed: ', err);
        }).catch((err) => {
            console.log(err);
        });
    });

    window.addEventListener('online', () => {
        document.querySelector('body').classList.remove('offline');
    }, false);

    window.addEventListener('offline', () => {
        document.querySelector('body').classList.add('offline');
    }, false);
} else {
    console.log('serviceWorker not supported on this device, cant work offline');
}
