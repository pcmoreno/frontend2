// use common.js for functions that need to be executed on page load

// performs feature query for navigator, then initialises service worker
if(location.protocol === 'https:'){
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
}

// typekit
(function(d) {
    var config = {
            kitId: 'was4bcb',
            scriptTimeout: 3000,
            async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);
