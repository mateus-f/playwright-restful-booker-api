@api @ping
Feature: Health check da API Restful Booker
  Como uma aplicação consumidora da API Restful Booker
  Quero verificar a disponibilidade da API
  Para confirmar que o serviço está operacional

  @smoke @funcional
  Scenario: Verificar a disponibilidade da API
    Given que a API esteja operacional
    When eu enviar uma requisição "GET" para a rota "/ping"
    Then o código de status HTTP retornado deve ser 201