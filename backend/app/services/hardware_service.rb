class HardwareService
  def initialize
    @keyService = KeysService.new
  end

  def processar_pedido_abertura(req, sentido)

    key_code = req[:key_code]
    door_identification = req[:door_identification]

    return false if Door.exists(door_identification).empty? #Verifica se a porta existe
    return false if @keyService.nova_chave(req) #Verifica se deve e cadastra uma nova chave para  porta

    door = Door.find_by(identification: door_identification) #Busca a porta

    return false if door.domain == nil #Verifica se a porta pertence a alguem

    key = Key.joins(:door).where("keys.code = ? and doors.identification = ?", key_code, door_identification) #busca a chave

    return false if key.blank? #confere se a chave existe
    key = key[0]
    return false if key.user.nil? #confere se a porta pertence a alguem

    return false if key.door != door #confere se a chave pertence a porta

    dia_da_semana = DateTime.current.wday #identifica o dia da semana
 
    permission = key.permissions.where(day_of_week: dia_da_semana)[0] #pega a permissao referente ao dia da semana corrente

    permission.schedules.each do |schedule| #retorna true se alguma schedule estiver valida
        if schedule.valid_now
          Access.create(user: key.user, door: key.door, type_access: sentido)
          return true 
        end
    end

    return false
  end

  def abertura_remota(req, sentido)
    door_identification = req[:door_identification]

    return false if Door.exists(door_identification).empty? #Verifica se a porta existe

    door = Door.find_by(identification: door_identification) #Busca a porta

    requisicoes = RemoteOpeningRequest.where(door: door)
    if (!requisicoes.empty?)#existe alguma requisição de abertura remota pendente
      Access.create(user: requisicoes.last.user, door: requisicoes.last.door, type_access: sentido)
      requisicoes.destroy_all
      return true
    end

    return false
  end
end