@api @auth
Feature: Autenticação na API Restful Booker
  Como uma aplicação consumidora da API Restful Booker
  Quero autenticar um usuário
  Para obter um token de acesso para futuras requisições

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Gerar token com credenciais válidas
    Given que eu possua um payload válido de autenticação
    When eu enviar uma requisição "POST" para a rota "/auth"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve conter o campo "token"
    And o campo "token" deve ser uma string não vazia

  @contrato
  Scenario: Validar o contrato da resposta de autenticação
    Given que eu possua credenciais válidas de autenticação
    When eu enviar uma requisição "POST" para a rota "/auth"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter somente o campo "token"
    And o campo "token" deve ser do tipo string

  @excecao
  Scenario Outline: Rejeitar credenciais inválidas
    Given que eu informe o usuário "<nome_usuario>" e a senha "<senha_usuario>"
    When eu enviar uma requisição "POST" para a rota "/auth"
    Then o código de status HTTP retornado deve ser 200
    And a resposta deve conter a mensagem de erro "Bad credentials"

    Examples:
      | nome_usuario | senha_usuario |
      | admin        | errada123     |
      | invalido     | password123   |
      |              | password123   |
      | admin        |               |
      |              |               |

  @seguranca
  Scenario: Autenticar enviando o Content-Type correto
    Given que eu possua credenciais válidas
    And o cabeçalho "Content-Type" seja "application/json"
    When eu enviar uma requisição "POST" para a rota "/auth"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve conter um token válido