# Etapa 1: Construção da aplicação
FROM node:20-alpine AS builder

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código-fonte
COPY . .

# Compile o código para produção
RUN npm run build

# Instale apenas as dependências de produção
RUN npm prune --production

# Etapa 2: Configuração do ambiente de execução
FROM node:20-alpine AS runner

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos necessários da etapa de construção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Exponha a porta padrão da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
