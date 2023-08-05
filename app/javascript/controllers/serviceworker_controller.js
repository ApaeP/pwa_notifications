import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="serviceworker"
export default class extends Controller {
  static targets = ["subscribe"]
  static values = {
    subscribed: Boolean,
    vapidPublicKey: String
  }

  connect() {
    this.vapidPublicKeyValue = window.vapidPublicKey
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
              applicationServerKey: window.vapidPublicKey
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
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ "subscription": subscription })
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
}
