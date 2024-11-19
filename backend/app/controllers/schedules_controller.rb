class SchedulesController < ApplicationController
  before_action :set_schedule, only: [:show, :update, :destroy]
  before_action :authenticate_user!
  before_action :injections

  def injections
    @rolesService = RolesService.new(current_user)
  end
  
  # # GET /schedules
  # def index
  #   @schedules = Schedule.all

  #   render json: @schedules
  # end

  # # GET /schedules/1
  # def show
  #   render json: @schedule
  # end

  # POST /schedules
  def create
    if (!@rolesService.is_my_permission(Permission.find(schedule_params[:permission_id])))
      render json: {data:{success:false, message: "Você não tem permissão para criar este horário."}}, status: :forbidden
      return
    end

    @schedule = Schedule.new(schedule_params)

    if @schedule.save
      render json: @schedule, status: :created, location: @schedule
    else
      render json: @schedule.errors, status: :unprocessable_entity
    end
  end

  # # PATCH/PUT /schedules/1
  # def update
  #   if @schedule.update(schedule_params)
  #     render json: @schedule
  #   else
  #     render json: @schedule.errors, status: :unprocessable_entity
  #   end
  # end

  # DELETE /schedules/1
  def destroy
    if (!@rolesService.is_my_permission(@schedule.permission))
      render json: {data:{success:false, message: "Você não tem permissão para remover esse horário."}}, status: :forbidden
      return
    end
    @schedule.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_schedule
      @schedule = Schedule.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def schedule_params
      params.require(:schedule).permit(:entry, :exit, :permission_id)
    end
end
