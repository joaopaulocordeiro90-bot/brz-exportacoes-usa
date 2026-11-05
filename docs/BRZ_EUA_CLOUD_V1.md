# BRZ Exportações USA — Sincronização e segurança (V1)

## Infraestrutura

- GitHub: `joaopaulocordeiro90-bot/brz-exportacoes-usa` (GitHub Pages, e95).
- Supabase exclusivo: `ckamifxyfmdjcomldsdb`, região `sa-east-1`. Não compartilha banco com BRZ Safras.
- Edge Function: `brz-eua-gateway` (único endpoint de administração).
- Dados USDA: arquivos do próprio build, **não** alterados pelo sincronizador.
- Dados editáveis: `display_state` (estado dos cards, textos, gráficos, paleta, tipografia) e `language` (preferência de idioma).
- Identidade visual do formulário de senha: reproduz BRZ Safras. O mesmo PIN de 6 dígitos é verificado com hash bcrypt no novo banco. A senha nunca vai para o GitHub.
- Sessão: token aleatório (256 bits) registrado por hash SHA-256, válido por 8 horas. Cinco tentativas erradas aplicam bloqueio temporário de 15 minutos.

## Persistência e conflitos

1. A sessão autorizada carrega as revisões de cada seção do Supabase.
2. O e95 mantém `brz_eua_state` e `brz_eua_language` no navegador como cache. Alterações salvas sincronizam para o banco; edições de campos e modo de edição acionam salvamento ao finalizar interação.
3. Cada gravação exige a revisão esperada; o banco rejeita gravações concorrentes. Rascunhos locais não são apagados por um conflito e podem ser recuperados por backup.
4. Nas atualizações remotas, uma cópia local de segurança é mantida antes de substituir o cache.
5. O painel `Histórico e backups` permite visualizar revisões, restaurar e gerar cópias externas AES-256-GCM, protegidas por senha diferente da de login.
6. Backup interno `pg_cron`: todo dia às **02:10 BRT (05:10 UTC)**, retenção prevista de 90 dias.

## Cuidados essenciais

- O GitHub Pages é público: a tela de login controla a interface administrativa e as operações no Supabase, **não** oculta arquivos USDA publicados no repositório.
- O HTML exportado em arquivo único omite a integração em nuvem e deve continuar abrindo sem internet, com o estado das edições incorporado.
- O `docs/SHA256SUMS.txt` verifica a base modular e95 original; o `index.html` tem alterações intencionais para login e sincronização. A verificação de QA exclui apenas o hash antigo do `index.html`.
- O botão `Limpar salvamento local` original não apaga o conteúdo do Supabase. A limpeza local será reposta no próximo carregamento. Exclusão remota requer procedimento administrativo separado.
- **Não considerar a migração de personalizações entre builds futuros do USDA automaticamente validada.** Como o e95 compara `build` e `dataAtual`, uma atualização semanal com nova versão exige testes de rebasing por ID de card (títulos/textos/legendas sem congelar gráficos antigos).

## Testes

- CI no PR: `node --check` em JavaScript, SHA256 de todos os arquivos originais exceto index modificado, referências locais, elementos de senha.
- Smoke Chromium isolado: login e read simulados (sem usar PIN real), aplicação acessível após autenticação, salvamento remoto simulado e exportação de HTML autocontido.
- **Antes de considerar concluído em produção:** verificar PIN real (sem divulgá-lo), salvar uma edição em navegador A e reler no B, provocar conflito sem perda local, baixar/restaurar backup, confirmar primeira execução de `pg_cron` e testar atualização do USDA para novo build.

## Rollback

O branch `main` anterior ao PR #1 continua como ponto de restauração. Ao reverter o commit de integração, o e95 volta a operar sem camada Supabase; os dados do banco permanecem preservados e não são excluídos.
