@api @booking
Feature: Gestão de reservas
  Como uma aplicação consumidora da API Restful Booker
  Quero gerenciar as reservas
  Para consultar, criar, atualizar e excluir dados de hospedagem

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Consultar todos os identificadores de reservas
    Given que eu possua uma consulta válida de identificadores de reservas
    When eu enviar uma requisição "GET" para a rota "/booking"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter os identificadores das reservas existentes

  @contrato
  Scenario: Validar o contrato da consulta de identificadores
    Given que eu possua uma consulta válida de identificadores de reservas
    When eu enviar uma requisição "GET" para a rota "/booking"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve ser uma lista de objetos
    And cada objeto da resposta deve conter o campo "bookingid"
    And o campo "bookingid" deve ser numérico

  @funcional
  Scenario: Filtrar reservas pelo nome do hóspede
    Given que existam reservas associadas ao nome "John"
    When eu enviar uma requisição "GET" para a rota "/booking?firstname=John"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter somente identificadores de reservas correspondentes ao nome "John"

  @funcional
  Scenario: Filtrar reservas pelo sobrenome do hóspede
    Given que existam reservas associadas ao sobrenome "Smith"
    When eu enviar uma requisição "GET" para a rota "/booking?lastname=Smith"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter somente identificadores de reservas correspondentes ao sobrenome "Smith"

  @funcional
  Scenario: Filtrar reservas pela data de check-in
    Given que existam reservas com data de check-in "2025-12-31"
    When eu enviar uma requisição "GET" para a rota "/booking?checkin=2025-12-31"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter reservas com check-in maior à data "2026-01-01"

  @funcional
  Scenario: Filtrar reservas pela data de checkout
    Given que existam reservas com data de checkout "2026-01-10"
    When eu enviar uma requisição "GET" para a rota "/booking?checkout=2026-01-10"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter reservas com checkout maior à data "2026-01-10"

  @funcional
  Scenario: Filtrar reservas combinando nome e período
    Given que existam reservas associadas ao nome "John" com sobrenome "Smith" no período de "2010-01-01" a "2026-01-10"
    When eu enviar uma requisição "GET" para a rota "/booking?firstname=John&lastname=Smith&checkin=2010-01-01&checkout=2026-01-10"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter somente identificadores correspondentes ao nome completo "John Smith" e ao período informado

  @excecao
  Scenario: Consultar reservas sem resultados correspondentes
    Given que eu informe o nome de hóspede "NomeInexistente"
    When eu enviar uma requisição "GET" para a rota "/booking?firstname=NomeInexistente"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve ser uma lista vazia

  @smoke @funcional
  Scenario: Consultar uma reserva existente
    Given que eu possua o identificador de uma reserva existente
    When eu enviar uma requisição "GET" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter os dados completos da reserva
    And a resposta deve conter os campos "firstname", "lastname", "totalprice", "depositpaid", "bookingdates" e "additionalneeds"

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
      | 9999999    |
      | abc        |
      | -1         |
      |            |

  @smoke @funcional
  Scenario: Criar uma reserva com sucesso
    Given que eu possua um payload válido de reserva
    When eu enviar uma requisição "POST" para a rota "/booking"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve conter o identificador da reserva criada
    And o corpo da resposta deve conter os dados da reserva criada
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
    Then o código de status HTTP de erro deve ser retornado
    And a resposta deve conter uma mensagem de validação

  @smoke @funcional
  Scenario: Atualizar uma reserva com sucesso
    Given que eu possua o identificador de uma reserva existente
    And que eu possua um token de autenticação válido
    And que eu possua um payload válido de atualização de reserva
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve conter os dados atualizados da reserva
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
    Given que eu possua um payload válido de atualização de reserva
    And que eu não informe credenciais de autenticação
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 403

  @excecao
  Scenario: Tentar atualizar uma reserva inexistente
    Given que eu possua um payload válido de atualização de reserva
    And que eu informe um identificador de reserva inexistente
    When eu enviar uma requisição "PUT" para a rota "/booking/{id_reserva}"
    Then o código de status HTTP retornado deve ser 405

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