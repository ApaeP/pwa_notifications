const onInstall = (event) => {
  console.log('[Serviceworker]', "Installing!", event);
}
const onActivate = (event) => {
  console.log('[Serviceworker]', "Activating!", event);
}
const onFetch = (event) => {
  console.log('[Serviceworker]', "Fetching!", event);
}
const onPush = (event) => {
  event.waitUntil(self.registration.showNotification('Example'));
}
// const onPushSubscriptionChange = (event) => {
//   console.log('[Serviceworker]', "Push Subscription Changing!", event);
//   // event.waitUntil(
//   //   fetch('', {
//   //     method: 'POST',
//   //     headers: { 'Content-Type': 'application/json' },
//   //     body: JSON.stringify({
//   //       old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
//   //       new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
//   //       new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
//   //       new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
//   //     })
//   //   })
//   // );
// }

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
self.addEventListener("push", onPush);
// self.addEventListener('pushsubscriptionchange', onPushSubscriptionChange);

// const getLocation = () => {
//   const options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0,
//   };

//   function success(pos) {
//     const crd = pos.coords;

//     console.log("Your current position is:");
//     console.log(`Latitude : ${crd.latitude}`);
//     console.log(`Longitude: ${crd.longitude}`);
//     console.log(`More or less ${crd.accuracy} meters.`);
//   }

//   function error(err) {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
//   }

//   navigator.geolocation.getCurrentPosition(success, error, options);
// }
