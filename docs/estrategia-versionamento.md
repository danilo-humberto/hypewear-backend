# Estratégia de Versionamento - HypeWear Backend

## 1. Contexto do projeto

O HypeWear Backend foi uma aplicação de um e-commerce utilizada em cadeiras anteriores para obtenção de nota final. Como o projeto não foi iniciado do zero para a atividade atual, foi necessário escolher uma estratégia de versionamento que pudesse ser atrelada ao fluxo atual sem precisar de grandes mudanças na estrutura.

Diante disso, buscamos organizar o desenvolvimento a partir da branch principal `main`, utilizando branches curtas para novas alterações, pull requests para revisão e um pipeline de CI para validar o código antes da integração, com o intuito de padronizar a forma como novas alterações são adicionadas ao projeto.

## 2. Problema identificado

Antes de definir a estratégia, o problema identificado foi a falta de um fluxo claro para realizar as integrações de códigos. Esse projeto foi feito em grupo de 3 pessoas. Era criada uma branch, sendo o título o nome da pessoa e lá eram feitas todas as alterações. Ou seja, acabava caindo na parte de **branches longas**, causando assim diversos conflitos na hora de puxar para main. Ademais, qualquer um poderia puxar as alterações para a main. O pull request era feito em forma de conversa. Discutíamos entre si e, se todos estivessem de acordo, a pessoa que fez as alterações fazia o merge.

Também estava presente a falta da realização dos testes, que antes eram feitos de forma manual. Então, muitas vezes os testes nem eram realizados. Dessa forma, tornava o processo menos previsível, pois os erros eram/podiam ser percebidos muito tarde.

> **Referência:** Humble & Farley discutem o risco da integração tardia e defendem a integração frequente como forma de reduzir conflitos, detectar problemas mais cedo e evitar branches longas.

## 3. Estratégia escolhida

A estratégia escolhida para o projeto foi o **GitHub Flow**.

A branch `main` concentra todo o código principal do projeto, enquanto as demais branches são criadas com um escopo específico e de curta duração. Após as alterações serem realizadas, é aberto um Pull Request. O merge para a main só deve acontecer depois da revisão e da validação do pipeline de CI.

> **Referência:** A documentação oficial do GitHub Flow apresenta um fluxo baseado em uma branch principal, branches curtas e Pull Requests para revisar e integrar alterações.

## 4. Motivo da escolha

O **GitHub Flow** foi escolhido porque oferece um equílibrio entre simplicidade e controle, tornando assim o mais adequado ao contexto do projeto. O **Git Flow** utiliza muitas branches fixas, sendo mais indicado para projetos com ciclos mais fechados de lançamento, o que não é o caso do presente projeto. Já sobre o **TBD**, ele também incentiva a integração frequente, porém exige uma maior maturidade em automação e testes.

Como o HypeWear é um projeto acadêmico já iniciado e é mantido por uma equipe pequena, o **GitHub Flow** se torna mais adequado, pois mantém branches curtas, revisões por meio dos Pull Requests e validação com um CI simples antes do merge.

## 5. Política de branches

A branch `main` representa a linha principal de desenvolvimento e deve conter apenas as alterações revisadas e validadas. Nenhum integrante da equipe deve realizar commits diretamente nela.

Para cada tipo de alteração, deve ser criada uma branch específica:

- `feature/*`: novas funcionalidades;
- `fix/*`: correções de erros;
- `ci/*`: alterações relacionadas ao pipeline e automação;
- `docs/*`: alterações de documentação.

As branches devem ser curtas, objetivas e relacionadas a uma única mudança principal.

## 6. Política de Pull Requests

Todo Pull Request deve ter uma descrição clara da alteração realizada. Incluindo também:

- O que foi feito;
- O motivo da alteração;
- Como testar;

O Pull Request só poderá ser mergeado após a revisão e a execução bem-sucedida do pipeline.

## 7. Critérios de revisão e merge

Para que uma branch seja mergeada com a `main`, alguns pontos devem ser atendidos:

- A alteração deve estar alinhada ao objetivo indicado no nome da branch;
- A branch precisa estar atualizada com a `main`;
- O código não deve apresentar conflitos;
- O Pull Request deve ter descrição e um motivo claro;
- O pipeline deve executar com sucesso. Caso falhe em alguma etapa, o merge deve ser bloqueado até que o problema seja corrigido;
- O Pull Request deve ser revisado por pelo menos um integrante do grupo;

## 8. Política de versionamento

O projeto utilizará Semantic Versioning, no formato:

`MAJOR.MINOR.PATCH`

- `MAJOR`: mudanças grandes ou incompatíveis;
- `MINOR`: novas funcionalidades compatíveis;
- `PATCH`: correções pequenas.

Exemplo:

- `v1.0.0`: primeira versão estável documentada;
- `v1.1.0`: adição de nova funcionalidade;
- `v1.1.1`: correção de bug.

Diante disso, a primeira versão documentada poderá ser marcada como `v1.0.0`, representando o estado do projeto após a adição da estratégia de versionamento e da integração contínua.

## 9. Fluxo visual da estratégia

```txt
                           ┌──────────────────────────────┐
                           │            main              │
                           │  código estável e validado   │
                           └──────────────┬───────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
        ┌────────────────────┐ ┌────────────────────┐ ┌──────────────────────────┐
        │feature/health-check│ │    ci/pipeline     │ │ docs/estrategia-version. │
        │alteração no código │ │   pipeline de CI   │ │ documentação do fluxo    │
        └──────────┬─────────┘ └──────────┬─────────┘ └────────────┬─────────────┘
                   │                      │                        │
                   ▼                      ▼                        ▼
        ┌────────────────────┐ ┌────────────────────┐ ┌──────────────────────────┐
        │   Pull Request     │ │   Pull Request     │ │      Pull Request        │
        │ revisão da feature │ │ validação do CI    │ │ revisão da documentação  │
        └──────────┬─────────┘ └──────────┬─────────┘ └────────────┬─────────────┘
                   │                      │                        │
                   └──────────────┬───────┴──────────────┬─────────┘
                                  ▼                      ▼
                         ┌─────────────────┐    ┌──────────────────┐
                         │ GitHub Actions  │    │ Revisão do grupo │
                         │ lint/build/test │    │ aprovação do PR  │
                         └────────┬────────┘    └────────┬─────────┘
                                  │                      │
                                  └──────────┬───────────┘
                                             ▼
                                  ┌──────────────────────┐
                                  │   Merge na main      │
                                  │ somente se aprovado  │
                                  └──────────────────────┘
```

> **Referência**: O fluxo se baseia no GitHub Flow e nos princípios de integração contínua apresentados por Humble & Farley, nos quais alterações pequenas e frequentes reduzem o risco de integração tardia.

## 10. Referências

- Humble, J.; Farley, D. _Entrega Contínua_.
- Documentação oficial do GitHub Flow.
