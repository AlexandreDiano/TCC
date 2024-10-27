class RegistrationsController < Devise::RegistrationsController
  before_action :configure_permitted_parameters, if: :devise_controller?
  respond_to :json

  def create
    build_resource(sign_up_params)
    
    resource.domain = get_domain
    resource.roletype = get_roletype
    resource.active = true
    
    resource.save

    if resource.errors.empty?
      render json: resource
    else
      render json: resource.errors
    end
  end

  private

  def get_domain
    if (!request.headers["Authorization"].nil?)
      authenticate_user!
      return current_user.domain
    else
      return (User.maximum('domain') || 0) + 1
    end
  end

  def get_roletype
    if user_signed_in?
      if (params["user"]["roletype"] != User.roletypes["user"] && params["user"]["roletype"] != User.roletypes["superuser"])  
        return User.roletypes["user"]
      end
      return params["user"]["roletype"]
    else
      return User.roletypes["superuser"]
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:cpf, :username, :password, :email, :name, :surname, :roletype])
  end

end
