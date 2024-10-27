class HardwareController < ApplicationController
  before_action :injections
  
  def injections
    @hardwareService = HardwareService.new
  end
  
  def solicita_entrada
    entrada_autorizada = @hardwareService.processar_pedido_abertura(abertura_params, 'Entrada')

    gerar_resposta(entrada_autorizada)
  end

  def solicita_saida
    saida_autorizada = @hardwareService.processar_pedido_abertura(abertura_params, 'Saída')

    gerar_resposta(saida_autorizada)
  end

  def verifica_solicitacoes_abertura
    abertura_autorizada = @hardwareService.abertura_remota(abertura_params, 'Remota')

    gerar_resposta(abertura_autorizada)
  end

  private

  def gerar_resposta(entrada_autorizada)
    if entrada_autorizada
      render json: { acesso: "OK" }
    else
      render json: { acesso: "NOK" }
    end
  end

  def abertura_params
      params.permit(:door_identification, :key_code, :tipo)
  end
  def abertura_remota_params
    params.permit(:door_identification)
end
end
