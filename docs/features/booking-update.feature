@api @booking @booking_update
Feature: Atualização completa de reservas
  Como uma aplicação consumidora da API Restful Booker
  Quero atualizar todos os dados de uma reserva
  Para manter o cadastro de hospedagem correto e protegido

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Atualizar uma reserva com sucesso
    Given que eu possua o identificador de uma reserva existente
    And que eu possua um token de autenticação válido
    And que eu possua um payload válido de atualização de reserva
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And os dados retornados devem corresponder aos dados enviados

  @contrato
  Scenario: Validar o contrato da resposta de atualização
    Given que eu possua um identificador de uma reserva existente
    And que eu possua um token de autenticação válido
    And que eu possua um payload válido de atualização de reserva
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve manter os campos obrigatórios do contrato de sucesso

  @seguranca
  Scenario Outline: Atualizar uma reserva utilizando autenticação suportada
    Given que eu possua um identificador de uma reserva existente
    And que eu possua um payload válido de atualização de reserva
    And que eu utilize autenticação por "<tipo_autenticacao>"
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve conter os dados atualizados da reserva

    Examples:
      | tipo_autenticacao |
      | cookie            |
      | basic             |

  @excecao
  Scenario: Tentar atualizar uma reserva sem autenticação
    Given que eu possua um identificador de uma reserva existente
    And que eu possua um payload válido de atualização de reserva
    And que eu não informe credenciais de autenticação
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 403

  @excecao
  Scenario: Tentar atualizar uma reserva inexistente
    Given que eu possua um payload válido de atualização de reserva
    And que eu possua um token de autenticação válido
    And que eu informe um identificador de reserva inexistente
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 405
