import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="serviceworker"
export default class extends Controller {
  static targets = ["subscribe"]
  static values = {
    subscribed: Boolean,
    vapidPublicKey: Array
  }

  connect() {
    this.vapidPublicKey = new Uint8Array(this.vapidPublicKeyValue)
  }

  subscribe(e) {
    e.preventDefault()
    this.#getSubscription()
  }

  #getSubscription() {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        return registration.pushManager.getSubscription()
          .then((subscription) => {
            if (subscription) {
              return subscription;
            }
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: this.vapidPublicKey
            }).catch((err) => {
              window.alert("Couldn't get subscription", err);
            });
          });
      }).then((subscription) => {
        this.#sendSubscription(subscription.toJSON())
      });
  }

  unsubscribe(e) {
    e.preventDefault()
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        this.#deleteSubscriptions()
        if (!subscription) subscription.unsubscribe();
      });
    });
  }

  #sendSubscription(subscription) {
    console.log("#sendSubscription", subscription);
    const body = { "subscription": subscription }
    body["subscription"]["device_id"] = this.#deviceId();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify(body)
    }
    fetch('/subscriptions', options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
  }

  #deleteSubscriptions() {
    console.log("#deleteSubscriptionss");
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    }
    fetch('/subscriptions', options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
  }

  #deviceId() {
    let deviceId = localStorage.getItem('DeviceId');

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('DeviceId', deviceId);
    }
    console.log("deviceId", deviceId);
    return deviceId;
  }
}
