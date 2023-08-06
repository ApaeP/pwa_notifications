class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    if user_signed_in?
      @subscriptions = current_user.subscriptions
      @subscribed = @subscriptions.any? {  |subscription| subscription.device_id == cookies[:DeviceId] }
    end
  end

  def send_test_push_notification
    PushNotificationService.send(current_user, "PagesController::send_test_push_notification #{Time.zone.now}")
    render json: { status: 'ok' }, status: :ok
  end
end
