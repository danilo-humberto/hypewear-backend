# Justificativa Técnica - HypeWear Backend

## 1. Redução de riscos

O GitHub Flow reduz riscos porque trabalha com branches curtas e Pull Requests antes do merge na `main`. No cenário anterior do projeto, alterações poderiam ficar acumuladas em branches sem um padrão, aumentando a chance de conflitos e dificultando a revisão.

Com o novo fluxo, cada alteração passa a ter uma branch específica, como `feature/health-check`, `ci/pipeline` ou `docs/estrategia-versionamento`. Isso melhora a rastreabilidade, evita commits diretos na `main` e permite que a equipe revise a mudança antes do merge.

> **Referência:** Humble & Farley, em _Entrega Contínua_, defendem que integrar frequentemente reduz o risco de integração tardia. O material do módulo também destaca que branches longas acumulam divergência e tornam merges mais difíceis.

## 2. Integração contínua e feedback rápido

O pipeline de CI complementa a estratégia de versionamento ao validar automaticamente as alterações enviadas ao repositório. A cada push ou Pull Request, o pipeline executa etapas como instalação de dependências, lint, build e testes automatizados.

Esse processo fornece feedback rápido, pois erros são identificados antes do merge na `main`. Assim, problemas de build, erros de formatação ou testes quebrados podem ser corrigidos ainda durante o desenvolvimento.

> **Referência:** Em _Entrega Contínua_, Humble & Farley apresentam a integração contínua como uma prática baseada em build e testes automatizados. Em _Acelerar_, Forsgren, Humble e Kim relacionam práticas DevOps com maior previsibilidade e qualidade no processo de entrega.

## 3. Build reprodutível

O pipeline também contribui para um build mais reprodutível. Em vez de depender apenas do ambiente local de cada integrante, as validações passam a ocorrer em um ambiente padronizado no GitHub Actions.

Isso reduz o problema conhecido como “na minha máquina funciona”, pois o projeto é validado por meio de comandos definidos no workflow. Dessa forma, a branch só deve ser integrada quando passar por um processo comum e automatizado de validação.

> **Referência:** Humble & Farley relacionam gestão de configuração e build reprodutível à previsibilidade do processo de entrega.

## 4. Redução de toil

A automação do pipeline reduz tarefas manuais repetitivas, como rodar lint, build e testes antes de cada merge. Essas atividades são importantes, mas podem gerar falhas quando dependem apenas da execução manual dos integrantes.

Com o GitHub Actions, essas validações passam a ser executadas automaticamente, diminuindo esquecimentos e tornando o processo mais confiável.

> **Referência:** O material de _Site Reliability Engineering_ do Google define toil como trabalho manual, repetitivo e automatizável. A automação é apresentada como forma de reduzir esse esforço operacional.

## 5. Conclusão

A combinação entre GitHub Flow e integração contínua torna o processo desse projeto mais organizado, previsível e seguro. As branches curtas reduzem o risco de conflitos, os Pull Requests melhoram a revisão e o pipeline automatizado fornece feedback rápido antes do merge.

Essa escolha também evita complexidade desnecessária. O Git Flow seria mais pesado para o contexto do projeto, enquanto o Trunk-Based Development exigiria maior maturidade em testes e automação. Por isso, o GitHub Flow foi considerado a estratégia mais adequada para um projeto acadêmico já existente e desenvolvido por uma equipe pequena.

## 6. Referências

- Humble, J.; Farley, D. _Entrega Contínua_.
- Forsgren, N.; Humble, J.; Kim, G. _Acelerar_.
- Google. _Site Reliability Engineering_.
- Material do módulo de DevOps: versionamento, integração contínua, automação e toil.
- Documentação oficial do GitHub Flow.
