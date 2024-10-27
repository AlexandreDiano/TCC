class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :injections

  def injections
    @accessesService = AccessesService.new(current_user)
    @usersService = UsersService.new(current_user)
    @rolesService = RolesService.new(current_user)
  end
  
  def dashinfos
    render json: { domain_users_count: User.where(domain: current_user.domain).count,
                   today_accesses_count: @accessesService.list_accesses_filter(DateTime.now, DateTime.now).count,
                   month_accesses_count: @accessesService.list_accesses_filter(DateTime.now.at_beginning_of_month, DateTime.now).count,
                   all_accesses_count: @accessesService.list_accesses_filter(DateTime.now.change(year:2019), DateTime.now).count }        
  end

  def lastsignup
    #render json: { last_}
  end

  def lastaccess
    render json: @accessesService.list_accesses_filter(DateTime.now.change(year:2019), DateTime.now).last.to_json(:include=> [:user, :door])
  end

  def accesshistory
    render json: @accessesService.list_accesses_filter(DateTime.now.change(year:2019), DateTime.now).last(5).to_json(:include=> [:user, :door])
  end
  
  def lastusers
    render json: @usersService.list_users.order(created_at: :desc).last(5)
  end

  def accesscount
    render json: @accessesService.list_accesses_filter_count(DateTime.now - 5.days, DateTime.now).group_by_day('accesses.created_at').count.to_json
  end
end