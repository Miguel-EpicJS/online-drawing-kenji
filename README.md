# online-drawing-kenji
Um aplicativo de desenho online onde você pode compartilhar seu desenho ao vivo, e outras pessoas podem modifical-lo

Webpack build com: `npm run build`
Run server com: `npm start`
Execute `redis-server` port `6379`

# Sugestões

## Crie seus certificados.
        openssl genrsa -out backend/certs/selfsigned.key

        openssl req -new -key backend/certs/selfsigned.key -out backend/certs/selfcsr.pem

        openssl x509 -req -days 365 -in backend/certs/selfcsr.pem -signkey backend/certs/selfsigned.key -out backend/certs/mycert.crt
## Lembre de instalar o prettier

## Faça PR sempre que for subir alguma alteração

## Utilize o `git pull --all` e `git rebase` para atualizar a sua branch

## Faça Squash and Marge

## Não faça commits direto na main

## Observe se há algum arquivo vazio no seu PR, pode apagar o trabalho feito

## Marque pelo menos 1 request review 

## Utilize bons nomes para o PR e assine para sabermos mapear caso dê algo errado

## Não dê push com console.log ou comentários no código a não ser que seja muito esclarecedor sobre um ponto de atenção e seja conciso

## Para dúvidas ou pontos de problemas sobre o código, utilize a plataforma Github para comentar e dar visibilidade (como a tab Issues, por exemplo)
