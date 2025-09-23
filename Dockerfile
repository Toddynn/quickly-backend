FROM node:22-alpine3.21

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia apenas o que é necessário para instalar dependências
COPY package.json pnpm-lock.yaml* ./

# Instala o pnpm e as dependências
RUN npm install -g pnpm@latest && pnpm install

# Copia o restante do projeto
COPY . .

# Gera os arquivos de build apenas se você quiser buildar (útil em prod)
# RUN pnpm run build

# Expõe a porta padrão do app
EXPOSE 3000

# Define o comando padrão (modo dev)
CMD ["pnpm", "run", "start:dev"]
