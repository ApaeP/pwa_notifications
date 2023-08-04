Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"

  # PWA notifications setup
  get "/service-worker.js", to: "service_worker#service_worker"
  get "/manifest.json",     to: "service_worker#manifest"
end
