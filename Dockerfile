# Node 22: mesma major usada para gerar o package-lock.json.
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
# npm ci, e nao npm install: instala exatamente o que esta' no lock. Com install, a imagem
# pode sair com dependencia diferente da que foi testada.
RUN npm ci

COPY . .

# Variaveis REACT_APP_* entram no bundle em tempo de build: passar por --build-arg.
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ARG REACT_APP_PALAVRA_PASSE
ENV REACT_APP_PALAVRA_PASSE=$REACT_APP_PALAVRA_PASSE

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Dev local: acrescenta um host ao connect-src para o front conseguir chamar o backend
# em localhost sem afrouxar o CSP de producao gravado no nginx.conf.
ARG CSP_CONNECT_EXTRA=""
RUN if [ -n "$CSP_CONNECT_EXTRA" ]; then \
      sed -i "s#connect-src 'self'#connect-src 'self' ${CSP_CONNECT_EXTRA}#g" /etc/nginx/conf.d/default.conf; \
    fi

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
