# QA_REPORT · BRZ EUA e95 modular

## Ambiente e método

- Chromium 153 headless (Playwright 1.63), Linux, sem acesso à internet.
- Servidor HTTP estático local. O e95 original foi servido em `/eua_orig/` e a versão modular em `/brz-exportacoes-usa/` (subdiretório, como no Pages).
- Os dois lados usaram **o mesmo relógio fixo** (04/11/2026 12:00) e **a mesma semente** de `Math.random`, em contextos de navegador isolados.
- Cada ação foi executada nas duas versões. A comparação foi feita por hash (texto da tela, nós, SVG, downloads, objetos de dados) e pixel a pixel (capturas de página inteira).

## A. Integridade de origem

| Item | Resultado |
|---|---|
| SHA-256 do arquivo recebido | `68206352509b1fae876df2515c765aca8a2f22ec7790ca8505ac245ea985749e`, **confere** com o pedido |
| Tamanho | 2.890.946 bytes, confere |
| Inventário | 6 `<style>`, 28 scripts executáveis, 1 `__HISTORY__` JSON e 7 imagens de cartão. Pedido citava 8 CSS; ver MIGRATION_REPORT §1 |

## B a F. Resultados

| # | Teste | Resultado | Evidência |
|---|---|---|---|
| 1 | Reconstrução byte a byte do original a partir dos módulos | **APROVADO** | SHA idêntico `68206352…749e`, 2.890.946 bytes |
| 2 | `node --check` dos 28 scripts extraídos e do adaptador | **APROVADO** | 29/29 sem erro |
| 3 | Referências relativas | **APROVADO** | 42 referências, 0 ausentes; sem caminhos absolutos, `localhost` ou `file:///` |
| 4 | Carga sem erros | **APROVADO** | 0 `pageerror` na carga, 0 requisições com falha, 0 HTTP 4xx/5xx, 0 requisições externas. Único aviso: `"#000"`, idêntico no original |
| 5 | `window.E` após todos os patches | **APROVADO** | Hash idêntico do JSON completo (590.941 caracteres) e das 6 chaves (`coms`, `nome`, `myw`, `dados`, `meta`, `deep`) |
| 6 | `__SAVED__`, `TYPO` | **APROVADO** | Hash idêntico |
| 7 | Escopo global | **APROVADO** | 366 globais nas duas versões, mesma lista |
| 8 | Texto da página após a carga | **APROVADO** | Idêntico |
| 9 | 9 telas, desktop 1440×900 | **APROVADO** | 9 capturas de página inteira com 0 pixel de diferença (Inicial com 7 cartões, Soja, Farelo, Óleo, Milho, Trigo, Vendas Semanais, Base, Opções) |
| 10 | 9 telas, mobile 390×844 | **APROVADO** | 9/9 com 0 pixel de diferença. Ver nota 1 |
| 11 | Idioma EN nas 9 telas | **APROVADO** | Estado idêntico tela a tela |
| 12 | Varredura de controles: botões, seletores de destino, semana e MY, abas, quadro, ampliar, modo dinâmico | **APROVADO** | 451 passos (desktop 338, mobile 113) com estado idêntico passo a passo |
| 13 | Downloads gerados na varredura: PNG estático, PNG dinâmico, CSV, XLSX, ZIP das 5 bases, PNG do quadro e da tabela de vendas | **APROVADO** | 128 arquivos byte-idênticos, inclusive marca d'água |
| 14 | Diálogos | **APROVADO** | Mesmo diálogo nos dois lados ("Apagar o salvamento local…") |
| 15 | Persistência: ciclo EN→PT, modo edição, SALVAR, recarregar | **APROVADO** | `brz_eua_state` idêntico (1.044.824 caracteres) e estado e texto após recarga idênticos, com espera de 350 ms e de 1.200 ms. Ver nota 2 |
| 16 | EXPORTAR HTML via HTTP | **APROVADO** | Arquivo modular = original byte a byte: `brz_eua_app_e95.html`, 2.891.272 bytes, SHA `b7d6fc07…1c43` |
| 17 | HTML exportado aberto isolado, sem internet | **APROVADO** | `window.E` carregado, 0 `<script src>`/`<link>`, sem erros (só o aviso `"#000"` do original) |
| 18 | Versão modular via file:// | **APROVADO COM LIMITAÇÃO** | Abre, 9 telas, dados OK; EXPORTAR HTML cancelado com aviso, sem arquivo (esperado) |
| 19 | ZIP extraído e retestado | **APROVADO** | `unzip -t` sem erro; `sha256sum -c` OK; reconstrução a partir do ZIP = e95 (`68206352…749e`); repetidos os testes 4 a 8, 11 e 16 com resultados iguais |

**Nota 1:** na primeira rodada mobile, 3 telas (Óleo, Milho, Trigo) tiveram 9 pixels diferentes no cabeçalho, com variação de 1 a 4 níveis de cor na suavização das bordas dos botões. Na repetição, as 3 deram 0 pixel. Foi transição em andamento no momento da captura, não conteúdo.

**Nota 2:** numa rodada que intercalava capturas de página inteira (que redimensionam a janela e redesenham os gráficos) antes do SALVAR, o estado salvo divergiu. Isolado o efeito das capturas, o teste foi repetido com duas esperas diferentes e deu idêntico nas duas. Na mesma rodada, o EXPORTAR HTML após recarga saiu byte-idêntico.

**Erro de área de transferência:** `Clipboard writeText: Write permission denied` aparece nas duas versões ao clicar no botão de copiar, porque o navegador de teste não concede permissão. É preexistente e não é regressão.

## Não executado / PENDENTE DE VALIDAÇÃO

- Publicação real no GitHub Pages: **PENDENTE DE VALIDAÇÃO** (simulada em subdiretório local).
- Firefox, Safari e celulares reais: **PENDENTE DE VALIDAÇÃO**.
- Arraste de zoom nos gráficos dinâmicos, tooltip por movimento do mouse, arraste e edição de texto no modo edição: não automatizados. O código é o mesmo, byte a byte; as capturas e os PNG dinâmicos idênticos cobrem a renderização.
- Teste visual de sankey ou heatmap isolado: coberto apenas pelas capturas de página inteira e pela varredura, sem roteiro por tipo de gráfico.
