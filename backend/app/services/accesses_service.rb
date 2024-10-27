class AccessesService
  def initialize(current_user)
    @current_user = current_user
  end

  def list_accesses
    if @current_user.admin?
      return Access.all.order('accesses.created_at DESC')
    end
    if @current_user.superuser?
      return Access.joins(:door).where("doors.domain = ?", @current_user.domain).order('accesses.created_at DESC')
    end
    return Access.joins(:door, :user).where("doors.domain = ? and users.id = ?", @current_user.domain, @current_user.id).order('accesses.created_at DESC')
  end
  
  def list_accesses_filter(initial_date, final_date, door_name = nil, cpf = nil)
    filtro_adicional = ""
    if door_name.present?
      portas = DoorsService.new(@current_user).list_doors.where("description like ?", "%#{door_name}%")
      filtro_adicional += " and door_id in (#{portas.map{|e| e.id }.join(", ")}) " if portas.present? 
    end

    if cpf.present?
      user = User.find_by(cpf: cpf)
      filtro_adicional += " and user_id = #{user.id}" if user.present? 
    end

    return list_accesses.where("accesses.created_at >= ? and accesses.created_at <= ?" + filtro_adicional , 
      initial_date.change(hour:0, min:0, sec:0), 
      final_date.change(hour:23, min:59, sec:59) + 5.hours)
      #não sei pq diabos as datas são salvas com +5 horas. Assim, as vezes 
      #acabam caindo pro outro dia
  end

  def list_accesses_count
    if @current_user.admin?
      return Access.all
    end
    if @current_user.superuser?
      return Access.joins(:door).where("doors.domain = ?", @current_user.domain)
    end
    return Access.joins(:door, :user).where("doors.domain = ? and users.id = ?", @current_user.domain, @current_user.id)
  end

  def list_accesses_filter_count(initial_date, final_date, door_name = nil, cpf = nil)
    filtro_adicional = ""
    if door_name.present?
      portas = DoorsService.new(@current_user).list_doors.where("description like ?", "%#{door_name}%")
      filtro_adicional += " and door_id in (#{portas.map{|e| e.id }.join(", ")}) " if portas.present? 
    end

    if cpf.present?
      user = User.find_by(cpf: cpf)
      filtro_adicional += " and user_id = #{user.id}" if user.present? 
    end

    return list_accesses_count.where("accesses.created_at >= ? and accesses.created_at <= ?" + filtro_adicional , 
      initial_date.change(hour:0, min:0, sec:0), 
      final_date.change(hour:23, min:59, sec:59) + 5.hours)
      #não sei pq diabos as datas são salvas com +5 horas. Assim, as vezes 
      #acabam caindo pro outro dia
  end
end