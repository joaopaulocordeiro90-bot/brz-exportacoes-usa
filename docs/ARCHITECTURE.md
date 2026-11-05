# ARCHITECTURE · BRZ EUA (Exportações USA) e95 modular

Todos os scripts são **clássicos** (sem `type="module"`, sem `defer`/`async`) e carregam de forma síncrona na mesma posição do bloco original. Assim, escopo global, ordem de execução e momento do `DOMContentLoaded` são os do e95.

## CSS (`<head>`, ordem da cascata)

| # | Arquivo | Tag original | Bytes |
|---|---|---|---|
| 1 | `css/01-base.css` | `<style>` | 13.406 |
| 2 | `css/02-e88-dinamico.css` | `<style id="brz-e88-dyn-style">` | 2.694 |
| 3 | `css/03-e88-quadro.css` | `<style id="brz-e88-quadro-style">` | 7.906 |
| 4 | `css/04-s31-zoom.css` | `<style id="brz-s31-zoom-style">` | 1.219 |
| 5 | `css/05-e88-mobile.css` | `<style id="brz-e88-mobile-style">` | 193 |
| 6 | `css/06-e88-home.css` | `<style id="brz-e88-home-style">` | 264 |

O e95 tem **6 blocos `<style>` reais**. As outras 3 ocorrências da string `<style` estão dentro do texto do `__HISTORY__` (1) e de strings JavaScript usadas na geração de PNG e XLSX (2). Elas continuam dentro dos respectivos arquivos, intactas.

## Scripts (`<body>`, ordem de execução)

O bloco `__HISTORY__` (JSON, não executável, 54 KB) fica **inline** no `index.html`, na posição original, antes de `eua-data`.

| # | Arquivo | Bloco original | Bytes | Função |
|---|---|---|---|---|
| 1 | `data/eua-data.js` | `eua-data` | 575.524 | `window.E`: base principal USDA (coms, nome, myw, dados, meta, deep) |
| 2 | `data/eua-state.js` | `eua-state` | 257.356 | `window.__SAVED__`: estado incorporado (cards, paleta, tipografia; build e75 · 22Out). O EXPORTAR HTML regrava este bloco |
| 3 | `data/patches/eua-data-e44.js` | `eua-data-e44` | 6.567 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 4 | `data/patches/eua-data-e45.js` | `eua-data-e45` | 4.191 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 5 | `data/patches/eua-data-e46.js` | `eua-data-e46` | 457 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 6 | `data/patches/eua-data-e49.js` | `eua-data-e49` | 4.500 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 7 | `data/patches/eua-data-e54.js` | `eua-data-e54` | 5.321 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 8 | `data/patches/eua-data-e61.js` | `eua-data-e61` | 4.416 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 9 | `data/patches/eua-data-e62.js` | `eua-data-e62` | 7.148 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 10 | `data/patches/eua-data-e63.js` | `eua-data-e63` | 6.995 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 11 | `data/patches/eua-vendest.js` | `eua-vendest` | 3.120 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 12 | `data/patches/eua-data-e64.js` | `eua-data-e64` | 13.045 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 13 | `data/patches/eua-data-e66.js` | `eua-data-e66` | 17.985 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 14 | `data/patches/eua-data-e67.js` | `eua-data-e67` | 942 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 15 | `data/patches/eua-data-e71.js` | `eua-data-e71` | 8.182 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 16 | `data/patches/eua-estimates-e72.js` | `eua-estimates-e72` | 1.754 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 17 | `data/patches/eua-data-e73.js` | `eua-data-e73` | 8.465 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 18 | `data/patches/eua-data-e86.js` | `eua-data-e86` | 7.208 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 19 | `data/patches/eua-data-e87.js` | `eua-data-e87` | 3.425 | Patch USDA, aplicado sobre `window.E` na ordem original |
| 20 | `js/charts/dyn-native.js` | `brz-dyn-native` | 39.406 | Modo dinâmico nativo em SVG (API compatível com ECharts, sem CDN). Publica `echarts` |
| 21 | `js/charts/fit.js` | `brz-fit` | 2.906 | Ajuste automático de rótulos após cada desenho. Publica `BRZFIT` |
| 22 | `js/core/app.js` | `(sem id)` | 298.461 | Motor principal (~298 KB): gráficos, cartões, Vendas Semanais, modo edição, collectState/saveState/exportarHTML, PNG/CSV, logo `LOGO_HREF` |
| 23 | `js/core/export-adapter.js` | **novo** | 9.786 | Adaptador do EXPORTAR HTML (ver MIGRATION_REPORT) |
| 24 | `js/modules/quadro.js` | `brz-eua-quadro` | 23.123 | Quadro da semana no topo de cada commodity. Publica `BRZQEUA` |
| 25 | `js/charts/q-zoom.js` | `brz-q-zoom` | 3.349 | Ampliar painéis do quadro. Publica `BRZQZOOM` |
| 26 | `js/utils/excel-writer.js` | `brz-xlsx` | 10.895 | Gerador .xlsx nativo (bloco `brz-xlsx`). Publica `BRZXLSX` |
| 27 | `js/modules/base-export.js` | `brz-eua-base-export` | 5.173 | Base de Dados → Excel completo. Publica `BRZEUAXLSX` |
| 28 | `js/modules/vendas-en.js` | `brz-eua-vendas-en` | 7.490 | Comentário de Vendas Semanais em inglês. Publica `gerarVendTextoEN` |
| 29 | `js/core/i18n.js` | `brz-i18n` | 50.001 | Seletor PT-BR / EN. Publica `BRZI18N`; envolve `alert`, `confirm`, `prompt`, `dynOff`, `renderVendas` |

São 28 scripts executáveis do e95 mais o adaptador. Os patches de `data/patches/` são carregados **um a um, na ordem original** (e44 → e87, com `eua-vendest` entre e63 e e64 e `eua-estimates-e72` entre e71 e e73). Nenhum foi consolidado.

## Imagens

| Arquivo | Tipo | Bytes |
|---|---|---|
| `assets/images/card-soja.jpg` | image/jpeg | 85.948 |
| `assets/images/card-farelo.jpg` | image/jpeg | 147.002 |
| `assets/images/card-oleo.jpg` | image/jpeg | 57.835 |
| `assets/images/card-milho.jpg` | image/jpeg | 159.589 |
| `assets/images/card-trigo.jpg` | image/jpeg | 167.840 |
| `assets/images/card-vendas.jpg` | image/jpeg | 106.542 |
| `assets/images/card-base.jpg` | image/jpeg | 161.004 |

São os bytes originais decodificados do base64, sem recompressão. A logo da marca d'água continua em base64 dentro de `js/core/app.js` (`LOGO_HREF`), porque os PNG montam um SVG-imagem, que não carrega arquivos externos.

## Persistência

Chaves de localStorage, sem alteração: `brz_eua_state` e `brz_eua_language`.

## Rede

O site não faz nenhuma requisição externa em funcionamento normal. O `app.js` herda do e88 uma função `ensureECharts()` com URLs de CDN (jsdelivr/unpkg), acionada apenas se `window.echarts` não existir. Como `dyn-native.js` sempre define `window.echarts` antes, ela não é usada (0 requisições externas nos testes). Fica registrada como dependência latente preexistente.

O único `fetch` novo está no adaptador: lê os arquivos do próprio site, e só ao clicar em EXPORTAR HTML.
