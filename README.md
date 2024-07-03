## Descrição

Este projeto consiste em uma API RESTful desenvolvida utilizando o framework NestJS para gerenciar contas bancárias, pagamentos e relatórios de transações, além de implementar funcionalidades de autenticação baseada em JWT e upload de imagens para Amazon S3.

## Insalação e configuração do projeto

## Pré-requisitos

- Docker instalado na máquina local.
- Docker Compose instalado na máquina local.

## 1. Configuração do arquivo `.env`

- Crie o arquivo .env na raiz do projeto as seguintes informações:

```properties
DATABASE_URL="postgresql://postgres:myP$W@localhost:5432/eabankdb?schema=public"

POSTGRES_DB=eabankdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=eabankP$W
```

- Estas variáveis serão utilizadas pelo Docker Compose para configurar o banco de dados.

## 2. Suba o banco de dados PostgreSQL como Docker Compose

- Execute o seguinte comando para construir e iniciar os serviços definidos no docker-compose.yml:

```bash
$ docker-compose up -d --build
```

- verifique se os container subiram corretamente:

```bash
$ docker-compose ps
```

- Você deverá ver algo semelhante a isso:

```bash
   Name              Command                State           Ports
--------------------------------------------------------------------
pgadmin       /entrypoint.sh                  Up       0.0.0.0:80->80/tcp
postgresdb    docker-entrypoint.sh postgres   Up       0.0.0.0:5432->5432/tcp
```

## Acessar o pgAdmin

- Se necessário, você pode acessar o pgAdmin para gerenciar o banco de dados PostgreSQL. Abra um navegador e vá para http://localhost:80.

- Use as credenciais configuradas no docker-compose.yml (PGADMIN_DEFAULT_EMAIL e PGADMIN_DEFAULT_PASSWORD).

## Variáveis do Amazon S3

- Adicione ao final do arquivo .env as seguinte variáveis para conexão do modulo de upload de arquivos

```properties
AWS_S3_REGION=us-east-2
AWS_ACCESS_KEY_ID=AAAABBBBCCCCDDDDEEEE
AWS_SECRET_ACCESS_KEY=abcdefghij1234567890abcdefghij123/456789
```

## Instalação

```bash
$ npm install
```

## Aplicando as migrações do banco de dados:

```bash
# Ambiente de desenvolvimento
$ npx prisma migrate dev

# Ambiente de produção
$ npx prisma migrate deploy
```

## Iniciando o App

```bash
# desenvolvimento
$ npm run start

# desenvolvimento com modo de observação (watch mode)
$ npm run start:dev

# v
$ npm run start:prod
```

## Testes

```bash
# testes unitários
$ npm run test
```
