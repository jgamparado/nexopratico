# Kit Entre Sessões — upsell

Página estática em PT-PT, com o design system partilhado em `../rebrand.css`.

- Pré-visualização: `/up1/` a partir da raiz do site.
- Destinos: preencher `acceptUrl` e `declineUrl` em `config.js`. Os botões ficam inativos enquanto os valores forem placeholders. A cobrança com um clique depende do destino e da sessão fornecidos pela plataforma de checkout.
- Pixel: espaço reservado no `<head>` de `index.html`; não há pixel ativo. Ao configurar, usar apenas PageView nesta página.
- Imagens: mockup e ficha ilustrativos em `../assets/`, ambos em WebP. A fotografia da Juliana também está em WebP.
- Copy: fornecida pelo utilizador; a recusa termina conforme o texto recebido, em «fichas de casa».
- Build: executar `python3 scripts/build.py` na raiz de `pagina ok`. A página será incluída em `dist/up1/`.

Validação: build, sintaxe JavaScript, recursos, contagem dos CTAs/FAQ, configuração dos links e limiar de 40% da barra móvel. Abertura conferida visualmente no Chrome; revisão visual móvel não concluída.
