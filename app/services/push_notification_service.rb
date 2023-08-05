class PushNotificationService
  class << self
    def send(user, message)
      new(user, message).send
    end
  end

  def initialize(user, message)
    @user = user
    @subscriptions = user.subscriptions
    @message = message
  end

  def send
    @subscriptions.each do |subscription|
      send_push_notification(subscription)
    end
  end

  private

  def send_push_notification(subscription)
    WebPush.payload_send(
      message: @message,
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh_key,
      auth: subscription.auth_key,
      vapid: {
        subject: "mailto:sender@example.com",
        public_key: ENV['VAPID_PUBLIC_KEY'],
        private_key: ENV['VAPID_PRIVATE_KEY']
      },
      ssl_timeout: 5,
      open_timeout: 5,
      read_timeout: 5
    )
  end
end
