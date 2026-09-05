@api @booking @booking_partial_update
Feature: Atualização parcial de reservas
  Como uma aplicação consumidora da API Restful Booker
  Quero atualizar parcialmente uma reserva
  Para alterar apenas os dados necessários e preservar os demais

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Atualizar parcialmente uma reserva com sucesso
    Given que eu possua um identificador de uma reserva existente
    And que eu possua um token de autenticação válido
    And que eu possua um payload parcial válido de reserva
    When eu enviar uma requisição "PATCH" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve conter os dados atualizados da reserva
    And os campos enviados devem estar atualizados na resposta
    And os campos não enviados devem ser preservados

  @contrato
  Scenario: Validar o contrato da resposta de atualização parcial
    Given que eu possua um identificador de uma reserva existente
    And que eu possua um token de autenticação válido
    And que eu possua um payload parcial válido de reserva
    When eu enviar uma requisição "PATCH" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve manter os campos obrigatórios do contrato de sucesso

  @funcional
  Scenario: Atualizar parcialmente uma reserva com múltiplos campos
    Given que eu possua um payload parcial válido com múltiplos campos
    When eu enviar uma requisição "PATCH" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And os campos enviados devem estar atualizados na resposta
    And os demais campos da reserva devem ser preservados

  @seguranca
  Scenario: Tentar atualizar parcialmente uma reserva sem autenticação
    Given que eu possua um payload parcial válido de reserva
    And que eu não informe credenciais de autenticação
    When eu enviar uma requisição "PATCH" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 403

  @excecao
  Scenario: Tentar atualizar parcialmente uma reserva inexistente
    Given que eu possua um payload parcial válido de reserva
    And que eu informe um identificador de reserva inexistente
    When eu enviar uma requisição "PATCH" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 405
