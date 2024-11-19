class UsersService
  def initialize(current_user)
    @current_user = current_user
  end

  def list_users
    if @current_user.admin?
      return User.all
    end
    if @current_user.superuser?
      return User.where(domain: @current_user.domain)
    end
  end

end