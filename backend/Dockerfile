# 1. Fase de Build (Instalação e Compilação)
FROM node:20-alpine AS builder

WORKDIR /app

# ADICIONE ISTO AQUI (INSTALAÇÃO DE OPENSSL E DEPENDÊNCIAS DE BUILD)
RUN apk add --no-cache openssl build-base
# -------------------------------------------------------------------

# Copiar arquivos de dependência
COPY package.json yarn.lock* ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN yarn build

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# ADICIONE ISTO AQUI NOVAMENTE (INSTALAÇÃO DE OPENSSL PARA O RUNTIME)
RUN apk add --no-cache openssl
# -------------------------------------------------------------------

# Copiar dependências e arquivos compilados
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Porta do aplicativo
EXPOSE 3991

# Comando de inicialização
CMD ["yarn", "start"]