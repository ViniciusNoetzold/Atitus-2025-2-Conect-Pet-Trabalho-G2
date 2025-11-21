# Atitus Maps

## Sobre
Atitus Maps é uma aplicação web para visualizar e cadastrar pontos geográficos em um mapa interativo. Usuários autenticados podem adicionar novos pontos clicando no mapa; os pontos são salvos em um backend e exibidos para todos os usuários.

## Recursos
- Visualização de pontos no mapa.
- Cadastro de novos pontos ao clicar no mapa.
- Autenticação de usuários.
- Integração com Google Maps.

## Tecnologias
- React (Vite)
- @react-google-maps/api
- Axios

## Pré-requisitos
- Node.js (v18+ recomendado)
- npm ou yarn
- Chave de API do Google Maps com acesso a Maps JavaScript API

## Instalação e execução
1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/atitus-maps.git
cd atitus-maps
```

2. Instale dependências:
```bash
npm install
# ou
# yarn
```

3. Crie o arquivo `.env` na raiz do projeto com sua chave do Google Maps:
```
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```
Observação: o prefixo `VITE_` é obrigatório para variáveis de ambiente no Vite.

4. Rode a aplicação em modo de desenvolvimento:
```bash
npm run dev
```

5. Abra no navegador:
http://localhost:5173

## Backend
O backend utilizado pela aplicação (API de pontos) está disponível em:
https://passing-agatha-atitus-0ca94c8f.koyeb.app/ws/point

(Adapte a URL do backend se estiver usando sua própria API.)

## Dicas e observações
- Restrinja o uso da chave do Google Maps para seu domínio ou localhost nas configurações do console do Google para evitar uso indevido.
- Se o mapa não carregar, verifique se a chave da API está correta e se a API Maps JavaScript está habilitada no console do Google.
- Para produção, configure variáveis de ambiente adequadas e revise políticas de segurança da API.

## Copiar exercício
Para criar um repositório a partir do template no GitHub, clique em "Copiar Exercício" (abre em nova aba):
<a id="copy-exercise" target="_blank" href="https://github.com/new?template_name=atitus-maps&template_owner=jaisonschmidt&name=atitus-maps&owner=%40me&visibility=public">
   <img src="https://img.shields.io/badge/📠_Copiar_Exercício-008000" height="25pt"/>
</a>

---
