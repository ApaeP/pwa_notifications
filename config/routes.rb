Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"

  get "/service-worker.js" => "service_worker#service_worker"
  get "/manifest.json" => "service_worker#manifest"
  post "/send_test_push_notification", to: "pages#send_test_push_notification", as: :send_test_push_notification
  resources :subscriptions, only: %i[create] do
    collection do
      delete :destroy
    end
  end
end
