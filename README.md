# BRZ EUA · Exportações Americanas · versão modular (e95)

Build: **e95 · 04Nov**. É a versão modular da base e95 (SHA-256 do HTML original: `68206352509b1fae876df2515c765aca8a2f22ec7790ca8505ac245ea985749e`), preparada para GitHub Pages. A cópia monolítica de rollback está mantida fora do repositório público. Dados USDA, gráficos, imagens, funções e comportamento são os do e95.

## Estrutura

```
index.html              estrutura das telas, __HISTORY__ e referências
css/                    6 folhas, na ordem da cascata original
js/core/                app.js (motor), i18n.js, export-adapter.js
js/charts/              dyn-native.js, fit.js, q-zoom.js
js/modules/             quadro.js, base-export.js, vendas-en.js
js/utils/               excel-writer.js
data/                   eua-data.js (window.E), eua-state.js (window.__SAVED__)
data/patches/           17 patches USDA, e44 a e87, na ordem original
assets/images/          7 fotos dos cartões da tela inicial
[não publicado]        e95 original preservado em backup privado (rollback)
tools/                  modularizar.py, remontar_arquivo_unico.py, manifest.json
docs/                   ARCHITECTURE, MIGRATION_REPORT, QA_REPORT, SHA256SUMS
```

## Executar localmente

- **Servidor HTTP (igual ao Pages):** na pasta, rodar `python3 -m http.server 8000` e abrir `http://localhost:8000/`.
- **Duplo clique (file://):** a plataforma abre e funciona. A exceção é o **EXPORTAR HTML**, que fica bloqueado com aviso, porque o navegador não permite ler os módulos em file://. Para uso offline com exportação, use a cópia original guardada privadamente ou um HTML gerado pelo EXPORTAR HTML.

## Testar

1. Abrir pelo servidor local, F12 > Console. O único aviso esperado é o `"#000" does not conform`, que já existe no e95.
2. Conferir os hashes dos arquivos publicados: na raiz, rodar `sha256sum -c docs/SHA256SUMS.txt`.
3. Conferir a reversão: rodar `python3 tools/remontar_arquivo_unico.py . /tmp/e95.html` e depois `sha256sum /tmp/e95.html`. O resultado deve ser `68206352…749e`.
4. Opções > EXPORTAR HTML: o arquivo baixado deve abrir sozinho, sem internet.

## Publicar no GitHub Pages (etapa posterior)

1. Criar o repositório, por exemplo `brz-exportacoes-usa`, e enviar **todo o conteúdo extraído do ZIP** para a raiz, incluindo o arquivo oculto `.nojekyll`.
2. Settings > Pages > *Deploy from a branch*, `main`, pasta `/ (root)`. Não usar `/docs`.
3. Endereço: `https://USUARIO.github.io/brz-exportacoes-usa/`. Todos os caminhos são relativos.

## Manutenção

| Tarefa | Como fazer |
|---|---|
| Nova semana USDA | Criar `data/patches/eua-data-eNN.js` no formato dos patches existentes e acrescentar `<script id="eua-data-eNN" src="data/patches/eua-data-eNN.js"></script>` logo após o e87 no `index.html` |
| Nova versão recebida em arquivo único | `python3 tools/modularizar.py <arquivo.html> <pasta_nova>`. Se houver bloco novo, o script para e indica o id a mapear |
| Gerar arquivo único | Usar o EXPORTAR HTML (inclui as edições) ou o `tools/remontar_arquivo_unico.py` |

**Atenção:** um patch acrescentado à mão não entra no manifesto do adaptador. Nesse caso, o EXPORTAR HTML mantém esse patch como `<script src>` e o arquivo exportado deixa de ser autocontido. Depois de incluir patches, faça um destes dois procedimentos:

- Remonte o arquivo único e rode de novo o `tools/modularizar.py`.
- Regenere o `tools/manifest.json` e o `js/core/export-adapter.js`.

Regras:

- Não renomear arquivos.
- Não usar `echarts`, `sheetjs` ou `xlsx` em nomes de arquivo .js, porque o EXPORTAR HTML remove scripts com esses termos.
- Manter a ordem das tags no `index.html`.
- Nomes de arquivo diferenciam maiúsculas e minúsculas no Pages.

Fase 2 (Supabase, login, sincronização) fica fora desta entrega.

## Segurança de publicação

**GitHub Pages é público:** os arquivos HTML, JavaScript e dados embutidos podem ser lidos por terceiros. Não guardar senhas, tokens, chaves de serviço ou informações confidenciais em arquivos publicados. A futura tela de login deverá controlar a operação no servidor; uma tela estática sozinha não restringe acesso ao código ou dados.
