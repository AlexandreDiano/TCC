class KeysController < ApplicationController
  before_action :set_key, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :injections

  def injections
    @keyService = KeysService.new(current_user)
    @rolesService = RolesService.new(current_user)
  end
  
  # GET /keys
  def index
    @keys = @keyService.list_keys

    render json: @keys.to_json(:include=> [:user, :door])
  end

  # GET /keys/1
  def show
    if (@rolesService.is_my_key(@key))
      render json: @key.to_json(:include=> [:user, :door, :permissions=> {include: :schedules}])
    else
      render json: {data:{success:false, message: "Voce não tem autorização para ver essa chave."}}, status: :forbidden
      return
    end

  end

  # POST /keys
  # def create
  #   @key = Key.new(key_params)

  #   if @key.save
  #     render json: @key, status: :created, location: @key
  #   else
  #     render json: @key.errors, status: :unprocessable_entity
  #   end
  # end

  # PATCH/PUT /keys/1
  def update
    if @keyService.update(key_params, @key)
      render json: @key
    else
      render json: {data:{success:false, message: "Voce não tem autorização para editar essa chave."}}, status: :forbidden
      return
    end
  end


  # DELETE /keys/1
  def destroy
    if (@rolesService.is_my_key(@key))
      @key.destroy
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_key
      @key = Key.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def key_params
      params.require(:key).permit(:description, :user_id)
    end
end
