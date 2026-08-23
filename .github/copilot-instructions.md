# Diretrizes para Escrita de Cenários de Testes de API (Gherkin / BDD)

Ao gerar ou refatorar especificações em Gherkin (`.feature`) para testes de API REST, você DEVE seguir rigorosamente este guia de estilo, convenções de tags e melhores práticas.

## 1. Idioma e Sintaxe Mista (Inglês x Português)

- **Estrutura/Keywords em Inglês:** Utilize obrigatoriamente as palavras-chave reservadas do Gherkin em inglês (`Feature`, `Background`, `Scenario`, `Scenario Outline`, `Examples`, `Given`, `When`, `Then`, `And`).
- **Conteúdo dos Testes em Português (pt-BR):** A descrição da funcionalidade, o texto dos passos (_steps_) e o comportamento esperado devem ser escritos em Português do Brasil.
- **Foco de API:** Evite termos de interface visual (como "clicar", "tela", "preencher campo"). Foque em contratos HTTP, recursos, rotas, payloads, status codes e parâmetros de rede.

## 2. Estrutura Padrão do Arquivo

Todo arquivo `.feature` deve conter:

1. Tag principal da funcionalidade no topo.
2. Título e narrativa do recurso (`Feature:`).
3. Contexto (`Background:`) para pré-condições repetitivas (se aplicável).
4. Cenários (`Scenario:`) e Esquemas de Cenário (`Scenario Outline:`) devidamente taggeados.

## 3. Padrão de Tags (`@`) e Rastreabilidade

Utilize tags para categorizar o nível, o tipo, a prioridade e a rastreabilidade do teste.

### Tipo de Teste (Obrigatório por Cenário)

- `@contrato`: Validação de JSON Schema e estrutura da resposta.
- `@funcional`: Validação da regra de negócio da API.
- `@excecao`: Cenários negativos, retornos 4xx/5xx e erros esperados.
- `@seguranca`: Validações de autenticação, autorização (JWT/Token) e CORS.

### Nível / Prioridade (Opcional)

- `@smoke`: Cenários críticos de saúde da API.
- `@regression`: Cenários que cobrem fluxos de regressão completos.

## 4. Diretrizes dos Passos (Given / When / Then / And)

### Given (Pré-condição e Dados)

- Indique explicitamente a preparação de _payloads_, parâmetros de busca (_query params_) ou estado inicial.
- **Exemplo:** `Given que eu possua um payload válido para criação de reserva`

### When (Ação HTTP)

- Especifique claramente o **Método HTTP** e a **Rota/Endpoint**.
- **Exemplo:** `When eu enviar uma requisição "POST" para a rota "/booking"`

### Then / And (Asserções e Validações)

- Sempre valide o **Status Code HTTP** como a primeira asserção.
- Valide os campos principais da resposta (_Response Body_ ou _Headers_).
- **Exemplo:** `Then o código de status HTTP retornado deve ser 200`
- **Exemplo:** `And o corpo da resposta deve conter o ID da reserva criada`

## 5. Parâmetros e "Scenario Outline" em `snake_case`

Sempre que houver variação de dados para testar o mesmo comportamento, utilize `Scenario Outline:` com `Examples:`.

- **Regra de Nomenclatura:** Os parâmetros dentro dos _placeholders_ `<...>` e no cabeçalho das tabelas de `Examples:` DEVEM obrigatoriamente utilizar a convenção **`snake_case`** (ex: `<id_reserva>`, `<status_code>`, `<nome_usuario>`).

### Padrão de Exemplo:

```gherkin
  @excecao
  Scenario Outline: Validar falha de autenticação com credenciais inválidas
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
```

## 6. Exemplo de Referência Completo

```gherkin
@api @booking
Feature: Gestão de Reservas
  Como uma aplicação consumidora da API Restful Booker
  Quero gerenciar os dados de reservas de hospedagem
  Para garantir o controle de clientes e estadias

  Background:
    Given que a API Restful Booker esteja operacional

  @smoke @funcional
  Scenario: Criar uma nova reserva com sucesso
    Given que eu possua um payload válido com dados de hospedagem
    When eu enviar uma requisição "POST" para a rota "/booking"
    Then o código de status HTTP retornado deve ser 200
    And o corpo da resposta deve conter o ID da reserva gerado
    And os dados da reserva retornada devem ser idênticos aos enviados

  @excecao
  Scenario Outline: Validar falha ao tentar buscar reserva com ID inexistente ou inválido
    Given que eu informe o ID de reserva "<id_reserva>"
    When eu enviar uma requisição "GET" para a rota "/booking/<id_reserva>"
    Then o código de status HTTP retornado deve ser <status_code>

    Examples:
      | id_reserva | status_code |
      | 9999999    | 404         |
      | abc        | 404         |
      | -1         | 404         |
```

## 7. Proibição de Payloads Inline (Docstrings / Data Tables)

- **NÃO UTILIZE** blocos de código JSON ou payloads extensos diretamente dentro dos passos do Gherkin (`"""..."""` ou tabelas).
- **Abstração Declarativa:** O passo deve apenas declarar a intenção do dado (ex: `Given que eu possua um payload de reserva com dados válidos`).
- A responsabilidade de construir, parametrizar e formatar o JSON de envio pertence exclusivamente às camadas de **Data Factory** ou **Fixtures**.
