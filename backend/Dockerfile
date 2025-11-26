# 1. Fase de Build (Instalação e Compilação)
FROM node:20-alpine AS builder

WORKDIR /app

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

# Copiar dependências e arquivos compilados
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Porta do aplicativo
EXPOSE 3991

# Comando de inicialização
CMD ["yarn", "start"]