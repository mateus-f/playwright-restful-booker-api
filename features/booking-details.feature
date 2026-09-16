@api @booking @booking_details
Feature: Consulta de uma reserva
  Como uma aplicação consumidora da API Restful Booker
  Quero consultar uma reserva específica
  Para obter seus dados completos por identificador

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Consultar uma reserva existente
    Given que eu possua o identificador de uma reserva existente
    When eu enviar uma requisição "GET" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter os dados completos da reserva

  @contrato
  Scenario: Validar o contrato dos dados da reserva
    Given que eu possua o identificador de uma reserva existente
    When eu enviar uma requisição "GET" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve manter os campos obrigatórios do contrato de sucesso

  @excecao
  Scenario Outline: Consultar uma reserva inexistente ou inválida
    Given que eu informe o identificador de reserva "<id_reserva>"
    When eu enviar uma requisição "GET" para a rota "/booking/<id_reserva>"
    Then o código de status HTTP retornado deve ser 404

    Examples:
      | id_reserva |
      |    9999999 |
      | abc        |
      |         -1 |
