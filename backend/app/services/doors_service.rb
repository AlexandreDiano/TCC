class DoorsService
  def initialize(current_user)
    @current_user = current_user
  end

  def list_doors
    if @current_user.admin?
      return Door.all
    end
    if @current_user.superuser?
      return Door.where(domain: @current_user.domain)
    end
  end

  def link_door(identification)
    door = Door.find_by(identification: identification)
    if (!door.nil?)
      if(door.domain.nil?)
        door.domain = @current_user.domain
        door.save!
        return true
      end
      return false
    end
    return false
  end
end