class KeysService

  def initialize(current_user = nil)
    @current_user = current_user
    @roleService = RolesService.new(current_user)
  end

  def list_keys
    if @current_user.superuser?
      return Key.joins(:door).where("doors.domain = ?", @current_user.domain)
    end
  end

  def nova_chave(req)
    if (!(req[:tipo] == "insert")) 
      return false
    end
    
    key_code = req[:key_code]
    door_identification = req[:door_identification]

    key = Key.joins(:door).where("keys.code = ? and doors.identification = ?", key_code, door_identification)

    if (key.empty?)
      door = Door.find_by(identification: door_identification)
      new_key = Key.create(code: key_code, door: door)

      return true
    end

    return false
  end

  def update(key_params, key)
    if (!@current_user.superuser?)
      return false
    end
    if (!@roleService.is_my_key(key))
      return false
    end
    if (!@roleService.is_my_user_or_me(User.find(key_params[:user_id])))
      return false
    end

      return key.update(key_params)
  end
end
