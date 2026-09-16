@api @booking @booking_list
Feature: Listagem e filtragem de reservas
	Como uma aplicação consumidora da API Restful Booker
	Quero consultar e filtrar reservas
	Para localizar hospedagens pelos seus identificadores, hóspedes e período

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
