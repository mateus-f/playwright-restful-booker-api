@api @booking @booking_creation
Feature: Criação de reservas
  Como uma aplicação consumidora da API Restful Booker
  Quero criar reservas
  Para registrar dados de hospedagem

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Criar uma reserva com sucesso
    Given que eu possua um payload válido de reserva
    When eu enviar uma requisição "POST" para a rota "/booking"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter o identificador da reserva criada
    And os dados retornados devem corresponder aos dados enviados

  @contrato
  Scenario: Validar o contrato da resposta de criação
    Given que eu possua um payload válido de reserva
    When eu enviar uma requisição "POST" para a rota "/booking"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve manter os campos obrigatórios do contrato de sucesso

  @excecao
  Scenario: Tentar criar uma reserva com payload inválido
    Given que eu possua um payload inválido de reserva
    When eu enviar uma requisição "POST" para a rota "/booking"
    Then o código de status HTTP retornado deve ser 500
    And a resposta deve conter uma mensagem de erro
