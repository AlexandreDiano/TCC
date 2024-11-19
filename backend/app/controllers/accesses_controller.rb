class AccessesController < ApplicationController
  before_action :set_access, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :injections

  def injections
    @accessesService = AccessesService.new(current_user)
    @rolesService = RolesService.new(current_user)
  end
  # GET /accesses
  def index
    if (!accesses_filter_params.present?)
      @accesses = @accessesService.list_accesses
    else
      datainicial = accesses_filter_params['datainicial'].to_datetime if accesses_filter_params['datainicial'].present?
      datafinal = accesses_filter_params['datafinal'].to_datetime if accesses_filter_params['datafinal'].present?
      nome_porta = accesses_filter_params['porta'].present? ? accesses_filter_params['porta'] : nil
      cpf = accesses_filter_params['cpf'].present? ? accesses_filter_params['cpf'] : nil



      @accesses = @accessesService.list_accesses_filter(
        datainicial || DateTime.new(2020,1,1), 
        datafinal || DateTime.new(2099,12,31),
        nome_porta,
        cpf)
    end

    render json: @accesses.to_json(:include=> [:user, :door])
  end

  # GET /accesses/1
  def show
    if(@rolesService.is_my_door(@access.door) && @rolesService.is_my_user_or_me(@access.user))
      render json: @access.to_json(:include=> [:user, :door])
    else
      render json: {data:{success:false, message: "Este accesso não esta vinculado a você."}}, status: :forbidden
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_access
      @access = Access.find(params[:id])
    end

    def accesses_filter_params
      params.permit(:datainicial, :datafinal, :porta, :cpf)
    end
end
