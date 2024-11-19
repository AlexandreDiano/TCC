class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :update]
  before_action :injections

  def injections
    @usersService = UsersService.new(current_user)
    @rolesService = RolesService.new(current_user)
  end

  # GET /users
  def index
    @users = @usersService.list_users

    render json: @users
  end

  # GET /users/1
  def show
    if(@rolesService.is_my_user_or_me(@user))
      render json: @user
    else
      render json: {data:{success:false, message: "Este usuario não pertence ao mesmo domínio que você."}}, status: :forbidden
    end
  end

  #PATCH/PUT /users/1
  def update
    if(@rolesService.is_my_user_or_me(@user))
      params["user"]["roletype"] = get_permitted_roletype
      if @user.update(user_params)
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  end

   private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    def get_permitted_roletype
      if user_signed_in?
        if current_user.user?
          return User.roletypes["user"]
        end

        if current_user.admin?
          return params["user"]["roletype"]
        end

        if (params["user"]["roletype"] != User.roletypes["superuser"] && params["user"]["roletype"] != User.roletypes["user"])  
          return User.roletypes["user"]
        end
        
        return params["user"]["roletype"]
      end
    end


    def user_params
      if current_user.admin?
        return params.require(:user).permit(:email, :cpf, :username, :name, :surname, :roletype, :domain, :active, :password)
      elsif current_user.superuser? || current_user.user?
        return params.require(:user).permit(:email, :cpf, :name, :surname, :roletype, :active, :password)
      end
    end
end
