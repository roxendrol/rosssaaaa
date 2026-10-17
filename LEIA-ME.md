# Royal Beauty 👑 — loja + painel da dona

Site em HTML/CSS/JS puro + funções serverless da Vercel (sem dependências para instalar).

## Publicar na Vercel (passo a passo)

1. Suba esta pasta para um repositório no GitHub (ou use `npx vercel` dentro da pasta).
2. Na Vercel: **Add New → Project →** escolha o repositório → **Deploy** (não precisa de nenhuma configuração de build).
3. **Banco de dados (obrigatório):** no projeto, aba **Storage → Create / Marketplace → Upstash Redis** (plano gratuito) e conecte ao projeto.
   Isso cria sozinho as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
4. **E-mail do código de confirmação (obrigatório):** crie conta grátis em https://resend.com **usando o mesmo e-mail que a dona vai cadastrar no painel**,
   crie uma *API Key* e, na Vercel, em **Settings → Environment Variables**, adicione:
   - `RESEND_API_KEY` = a chave criada
   - (opcional, recomendado) `ADMIN_EMAIL` = e-mail da dona. Só ele poderá criar o acesso ao painel.
   - (opcional) `EMAIL_FROM` = `Royal Beauty <contato@seudominio.com.br>` — só depois de verificar um domínio no Resend.
     Sem domínio, o Resend só entrega para o e-mail da própria conta dele, por isso o passo acima.
   - (opcional) `AUTH_SECRET` = qualquer texto longo e aleatório (se não definir, o sistema gera um sozinho).
5. Faça **Redeploy** (Deployments → ⋯ → Redeploy) para as variáveis valerem.
6. **Logo após publicar, acesse `seusite.vercel.app/admin`** e faça o cadastro: e-mail + senha → chega um código de 6 números no e-mail → digite e pronto.
   Quem acessar primeiro cadastra o painel, então faça isso na hora (ou defina `ADMIN_EMAIL`).

HTTPS é automático na Vercel (e o site força HTTPS com HSTS).

## O que a dona consegue fazer em /admin
- Entrar de qualquer celular/computador com e-mail + senha (sessão de 30 dias; "esqueci a senha" por código no e-mail).
- Produtos: criar, editar título/preço/descrição/categoria, trocar a foto direto da galeria do celular, ocultar ou excluir.
- Categorias: criar, renomear, trocar emoji, mudar a ordem e apagar.
- Botão **Voltar para a loja**, trocar senha e sair de todos os aparelhos.

## Segurança
Senha com scrypt; sessão em cookie HttpOnly/Secure/SameSite=Strict assinado; limite de tentativas de login e de códigos;
proteção contra CSRF; cabeçalhos de segurança + CSP (sem scripts de terceiros); upload só de JPG/PNG/WebP validados.

## Testar no computador
`node dev.js` → http://localhost:3000 (sem Upstash/Resend o código aparece na tela do painel, só em modo teste).

## Contatos já configurados
WhatsApp +55 51 99889-4537 · Instagram @royalbeauty_poa (em `public/js/common.js`).
