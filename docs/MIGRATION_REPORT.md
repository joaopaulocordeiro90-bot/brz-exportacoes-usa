# MIGRATION_REPORT · BRZ EUA e95 → estrutura modular

Data: 04/11/2026. Base: `brz_eua_app_e95 (1).html`, build **e95 · 04Nov**, 2.890.946 bytes, SHA-256 `68206352509b1fae876df2515c765aca8a2f22ec7790ca8505ac245ea985749e`. O hash foi conferido antes de iniciar.

Escopo: separação arquitetural para GitHub Pages. Nenhuma alteração de dados USDA, cálculos, layout ou comportamento.

## 1. Resumo

| Item | Antes | Depois |
|---|---|---|
| index.html | 2.890.946 bytes | 307.897 bytes (−89,3%) |
| Blocos `<style>` | 6 inline | 6 em `css/` (01 a 06) |
| Scripts executáveis | 28 inline | 28 em arquivos: 9 de código em `js/`, 2 bases em `data/`, 17 patches em `data/patches/` |
| `__HISTORY__` | inline | inline, sem alteração |
| Imagens dos 7 cartões | base64 inline | 7 jpg em `assets/images/` |
| Código novo | n/a | 1 arquivo: `js/core/export-adapter.js` |

O `index.html` ainda tem 307 KB porque o e95 traz os cartões das telas pré-renderizados no HTML (cerca de 239 KB) e o `__HISTORY__` (54 KB). Os dois são conteúdo original e foram mantidos.

**Divergência com o pedido:** o pedido cita 8 blocos CSS. O arquivo tem 6 blocos `<style>` reais. As outras 3 ocorrências de `<style` estão dentro do JSON do `__HISTORY__` e de strings JavaScript do PNG e do XLSX. Nada foi omitido (ver prova de reversão).

## 2. Método

1. Tokenizador que segue a regra do parser HTML para `<style>` e `<script>` (o conteúdo termina no primeiro `</style>` ou `</script>`).
2. **Extração byte a byte.** O conteúdo entre as tags foi gravado sem alteração. Cada bloco virou `<link rel="stylesheet">` ou `<script src>`, na mesma posição.
3. Os scripts continuam clássicos e síncronos, preservando escopo global, ordem dos patches e inicialização.
4. Imagens: o base64 foi decodificado para arquivo. A recodificação reproduz exatamente o original, o que foi verificado.
5. Os nomes de arquivo evitam os termos `echarts`, `sheetjs` e `xlsx`. O `exportarHTML` remove do DOM qualquer `<script src>` com esses termos (linha herdada do e88). Por isso o bloco `brz-xlsx` virou `js/utils/excel-writer.js`.
6. **Prova de reversibilidade:** `tools/remontar_arquivo_unico.py` reconstrói o arquivo único a partir dos módulos. O resultado é idêntico byte a byte ao e95, com o mesmo SHA-256.

Há duas garantias distintas:

- **Reconstrução exata:** os módulos voltam ao arquivo e95 original, bit a bit.
- **Equivalência funcional:** a versão modular, rodando no navegador, produz o mesmo estado, as mesmas telas, os mesmos downloads e o mesmo EXPORTAR HTML (ver QA_REPORT).

## 3. Dados USDA

- `data/eua-data.js`: `window.E` base, 575.524 bytes.
- 17 patches em `data/patches/`, na ordem original: e44, e45, e46, e49, e54, e61, e62, e63, vendest, e64, e66, e67, e71, estimates-e72, e73, e86, e87.
- `data/eua-state.js`: `window.__SAVED__`. É externo; quando o EXPORTAR HTML regrava o conteúdo em tempo de execução, o adaptador mantém esse conteúdo novo e remove o `src`.
- Formato `.js` (atribuição a `window.*`), não `.json` com fetch. Assim a carga continua síncrona, na ordem dos patches, e funciona em Pages e em file://.
- Verificação no navegador, depois de todos os patches: hash de `JSON.stringify` idêntico para `window.E` (590.941 caracteres) e para cada uma das 6 chaves (`coms`, `nome`, `myw`, `dados`, `meta`, `deep`), além de `__SAVED__` e `TYPO`. Com o mesmo JSON, ficam preservadas as distinções zero/`null`, safra corrente/nova, observado/estimado e China/UNKNOWN.

## 4. Único código novo: `js/core/export-adapter.js`

**Problema:** `exportarHTML()` serializa `document.documentElement.outerHTML`, cria um Blob e baixa via `a.click()` com o nome `brz_eua_app_e95.html`. Na versão modular, isso geraria um HTML dependente das pastas.

**Solução:** o e95 não tem função de download central. Por isso o adaptador envolve `HTMLAnchorElement.prototype.click` e atua apenas quando há três condições juntas: nome `brz_eua_app_*.html`, `href` do tipo `blob:` e conteúdo com a tag do próprio adaptador. Nesse caso, lê o Blob, busca os arquivos do próprio site, devolve `<link>` → `<style>`, `<script src>` → `<script>` (preservando o `__SAVED__` regravado) e imagens → base64, remove a própria tag e baixa o resultado. Os outros downloads (PNG, CSV, XLSX, ZIP) passam direto, de forma síncrona e sem alteração.

**Resultado testado:** o HTML exportado pela versão modular é **byte-idêntico** ao exportado pelo e95 original: SHA-256 `b7d6fc07e0f0cdd9e1c0fec7917d6363c500638bb9f3dd706985bdfd1a671c43`, 2.891.272 bytes, com mesmo estado e mesmo relógio. Ele abre isolado, sem internet, com 0 referências externas.

**Limitação:** em file://, o navegador bloqueia o `fetch`. O adaptador cancela com aviso (PT/EN) e não gera arquivo incompleto.

Nenhuma outra linha de código foi escrita ou alterada. O `__HISTORY__` não foi editado, porque isso quebraria a reversão byte a byte. A mudança arquitetural fica registrada neste documento.

## 5. `__HISTORY__` e formato single-file

O `__HISTORY__` orienta manter o formato de arquivo único. Por pedido expresso de 04/11/2026, essa orientação foi substituída pela modularização. O arquivo único continua disponível de duas formas: o original em `original/` e o EXPORTAR HTML, que gera um arquivo único autocontido a partir da versão modular.

## 6. Problemas preexistentes (documentados, não corrigidos)

1. Aviso de console nas duas versões: `The specified value "#000" does not conform to the required format` (um `<input type="color">` recebe `#000` em vez de `#000000`).
2. Função `ensureECharts()` com URLs de CDN, latente (ver ARCHITECTURE).
3. O botão de copiar texto usa `navigator.clipboard.writeText`. Sem permissão de área de transferência, gera erro nas duas versões (visto no navegador de teste).

## 7. Riscos remanescentes

1. **Origem:** salvamentos do arquivo local não aparecem no Pages. O domínio `USUARIO.github.io` é compartilhado entre os repositórios da conta. As chaves têm prefixo `brz_eua_`, então o risco de colisão é baixo.
2. **Repositório público:** a base USDA, o estado salvo e o original ficam acessíveis.
3. **Cache:** depois de uma atualização, o navegador pode misturar arquivos antigos e novos; recarregar sem cache resolve.
4. Não testado em Firefox/Safari nem no Pages real.

## 8. Hashes SHA-256 (principais)

| Arquivo | Bytes | SHA-256 |
|---|---|---|
| `original/brz_eua_app_e95.html` | 2.890.946 | `68206352509b1fae876df2515c765aca8a2f22ec7790ca8505ac245ea985749e` |
| `index.html` | 307.897 | `4f0db83953e3de74f5be89184388e508735f4f70820f14892d73b4343a336ba5` |
| `data/eua-data.js` | 575.524 | `3037ae0ddad5a607f903bbe9f2881773da13aafe4373d0649d6671b59faa0933` |
| `data/eua-state.js` | 257.356 | `0a3c95417f0acad1b6cada01ab9a80df148fd2f3330420d10ee56f7bf7b73dfc` |
| `js/core/app.js` | 298.461 | `dfc38259b1dcced257e36fd45cefda56420f9dc700a408503806c21027ab1248` |
| `js/core/export-adapter.js` | 9.786 | `44e94f6e43b8c8db50296de2434dacf8c0f44130a53c9a8ee97b6352ef581e11` |
| `js/core/i18n.js` | 50.001 | `5ed408904fe9aba90f913f9444109f3d09079cd0da7e2ebe9d6ac053580c985c` |
| `js/charts/dyn-native.js` | 39.406 | `7290ba9cabe38828757812f6d8f33d98a1f2c8d874a49b30aae76a0639fec5bc` |
| `js/modules/quadro.js` | 23.123 | `8ff800a00706bcc1d6ef7e09e5c55903a601270f3c6bbe7298bee12b8ef9d4ad` |
| `css/01-base.css` | 13.406 | `d7cf77f903a97c5c22d8b289da897665cb902c4b0554778218cbfe14b5e61bbc` |
| `css/03-e88-quadro.css` | 7.906 | `f00d90edbf89e7dde7897a985b1fee40465811dbae53b87cbb4e426d7b0a2f06` |

Lista completa: `docs/SHA256SUMS.txt`.
