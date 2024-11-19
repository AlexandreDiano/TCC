class DoorsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_door, only: [:show, :update, :destroy, :criar_solicitacao_abertura]
  before_action :injections

  def injections
    @doorService = DoorsService.new(current_user)
    @rolesService = RolesService.new(current_user)
  end

  # GET /doors
  def index
    @doors = @doorService.list_doors

    render json: @doors
  end

  # GET /doors/1
  def show
    if(@rolesService.is_my_door(@door))
      render json: @door
    else
      render json: {data:{success:false, message: "Esta porta não esta vinculada a você."}}, status: :forbidden
    end
  end

  # POST /doors
  def create
    if (!current_user.admin?)
      render json: {data:{success:false, message: "Apenas adm do sistema podem cadastrar novas portas."}}, status: :forbidden
      return
    end

    @door = Door.new(door_params)  
    if @door.save
      render json: @door, status: :created, location: @door
    else
      render json: @door.errors, status: :unprocessable_entity
    end
  end

  def link
    if (!current_user.superuser?)
      render json: {data:{success:false, message: "Você não tem permissão para vincular portas a um dominio."}}, status: :forbidden
      return
    end
  
    if @doorService.link_door(link_door_params[:identification])
      render json: {data:{success: true, message: "Porta vinculada com sucesso"}}, status: :ok
    else
      render json: {data:{success: false, message: "Erro ao vincular a porta"}}, status: :unprocessable_entity
    end
  
  end

  def criar_solicitacao_abertura
    if (@rolesService.is_my_door(@door) && current_user.superuser?)
      RemoteOpeningRequest.create(user: User.find(current_user.id), door: @door)
      render json: {data:{success: true, message: "Solicitação de abertura criada."}}, status: :ok
    else
      render json: {data:{success: false, message: "Você não tem permissão para abrir esta porta"}}, status: :forbidden
    end
  end

  # PATCH/PUT /doors/1
  def update
    if (current_user.admin?)
      update_door(door_params)
    else
      if (current_user.superuser?)
        if (@rolesService.is_my_door(@door))   
          update_door(door_params_superuser)
        end   
      end
    end
  end

  # DELETE /doors/1
  def destroy
    if (current_user.admin?)
      @door.destroy
    else
      if (current_user.superuser?)
        if (@rolesService.is_my_door(@door))   
          @door.domain = nil
          @door.description = ''
          if @door.save
            render json: {}, status: :no_content
          else
            render json: @door.errors, status: :unprocessable_entity
          end
        else
          render json: {data:{success:false, message: "Esta porta não esta vinculada a você."}}, status: :forbidden
        end   
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_door
      @door = Door.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def door_params_superuser
      params.require(:door).permit(:description)
    end

    def link_door_params
      params.permit(:identification)
    end

    def door_params
      params.require(:door).permit(:identification, :description)
    end

    def update_door(parameters)
      if @door.update(parameters)
        render json: @door
      else
        render json: @door.errors, status: :unprocessable_entity
      end
    end
end
