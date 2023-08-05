class SubscriptionsController < ApplicationController
  def create
    sub_params = {
      endpoint: subscription_params[:endpoint],
      p256dh_key: subscription_params[:keys][:p256dh],
      auth_key: subscription_params[:keys][:auth]
    }
    if current_user.subscriptions.create(sub_params)
      render json: { status: 'ok' }, status: :ok
    else
      render json: { status: 'error' }, status: :unprocessable_entity
    end
  end

  def destroy
    if current_user.subscriptions.destroy_all
      render json: { status: 'ok' }, status: :ok
    else
      render json: { status: 'error' }, status: :unprocessable_entity
    end
  end

  private

  def subscription_params
    params.require(:subscription).permit(:endpoint, :expirationTime, keys: %i[p256dh auth])
  end
end
