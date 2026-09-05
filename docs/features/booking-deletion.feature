@api @booking @booking_deletion
Feature: Exclusão de reservas
  Como uma aplicação consumidora da API Restful Booker
  Quero excluir reservas
  Para remover hospedagens que não devem mais permanecer cadastradas

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Excluir uma reserva com sucesso
    Given que eu possua o identificador de uma reserva existente
    And que eu possua uma autorização válida para exclusão
    When eu enviar uma requisição "DELETE" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 201
    And a reserva deve ser excluída com sucesso

  @seguranca
  Scenario Outline: Excluir uma reserva utilizando autenticação suportada
    Given que eu possua o identificador de uma reserva existente
    And que eu utilize autenticação por "<tipo_autenticacao>"
    When eu enviar uma requisição "DELETE" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 201
    And a reserva deve ser excluída com sucesso

    Examples:
      | tipo_autenticacao |
      | cookie            |
      | basic             |

  @excecao
  Scenario: Tentar excluir uma reserva sem autenticação
    Given que eu possua o identificador de uma reserva existente
    And que eu não informe credenciais de autenticação
    When eu enviar uma requisição "DELETE" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 403

  @excecao
  Scenario: Tentar excluir uma reserva inexistente
    Given que eu informe um identificador de reserva inexistente
    And que eu possua uma autorização válida para exclusão
    When eu enviar uma requisição "DELETE" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 405
