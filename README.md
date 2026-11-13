# Desafio200

## Publicar

1. Crie um projeto em https://neon.com. Em **Connect**, copie a connection string completa. Pode usar **Connection pooling**. Preserve os parâmetros SSL. A URL contém senha: não envie para GitHub nem coloque em variáveis VITE_.
2. Crie um repositório GitHub e envie o conteúdo desta pasta. Deixe package.json e render.yaml na raiz. Não envie .env, data ou node_modules.
3. Em https://dashboard.render.com, escolha **New > Web Service**, conecte o repositório e selecione runtime Node.
4. Configure:
   - Build Command: `npm install --include=dev && npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/healthz`
5. Em Environment, adicione:
   - `NODE_ENV`: `production`
   - `NODE_VERSION`: `24`
   - `DATABASE_URL`: a URL completa copiada do Neon.
6. Clique em Deploy. A tabela é criada automaticamente na primeira inicialização. Se a conexão falhar, confira DATABASE_URL e os logs sem compartilhar a senha.
7. Abra o link HTTPS do Render. Registre um depósito, recarregue e confira em outro dispositivo. Reinicie o serviço Render e confira que o registro permaneceu.

Alternativamente, use **New > Blueprint**: o render.yaml já contém essa configuração e pedirá DATABASE_URL. Se enviar a pasta desafio inteira dentro do repositório, configure Root Directory como desafio na criação manual do serviço.

O Render gratuito pode dormir quando inativo. O dinheiro registrado continua no banco externo Neon, mesmo quando a aplicação reinicia. Consulte os limites atuais dos planos dos dois serviços.

## Acesso

Sem login individual: qualquer pessoa com acesso ao link pode selecionar Gui ou Helen e alterar ambas as cartelas. Para limitar aos dois, é necessário adicionar autenticação. A aplicação não realiza transferências bancárias.

## Local

Node.js 24. Execute `npm install` e `npm run dev`.
Sem DATABASE_URL usa SQLite em data/challenge.sqlite. Para desenvolver com Neon, copie .env.example para .env e preencha a conexão (use banco/branch de desenvolvimento para não alterar dados reais).

Para produção: execute `npm run build`, configure NODE_ENV=production e DATABASE_URL e execute `npm start`. A porta vem de PORT ou usa 3001. Frontend e API compartilham a mesma origem.

Registros SQLite antigos não são importados automaticamente para Neon. Preserve o arquivo original antes de trocar o banco. O histórico permite exportar JSON para backup/consulta, mas não importar.

## Validação

`npm test` verifica total de R$ 20.100, conclusão, separação por pessoa e validação dos números. PostgreSQL usa consultas parametrizadas, chave primária por pessoa/valor e uma única operação atômica para cada confirmação. A conexão com Neon e o deploy real ainda precisam ser verificados após configurar as contas.
# desafio200

## Cores por participante
Na seção do depósito, escolha Gui ou Helen, selecione a cor e clique em Salvar cor. O backend cria automaticamente player_settings no Neon sem alterar deposits. Para instalar esta atualização, substitua os arquivos no repositório e faça novo deploy no Render mantendo DATABASE_URL. As cores aparecem na cartela, no avatar e no progresso. Confirme no Neon com: SELECT player, color FROM player_settings;

