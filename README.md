# online-drawing-kenji
Um aplicativo de desenho online onde você pode compartilhar seu desenho ao vivo, e outras pessoas podem modifical-lo

# Sugestões

## Crie seus certificados.
        openssl genrsa -out backend/certs/selfkey.key

        openssl req -new -key backend/certs/selfkey.key -out backend/certs/selfcsr.pem

        openssl x509 -req -days 365 -in backend/certs/selfcsr.pem -signkey backend/certs/selfkey.key -out backend/certs/selfcerts.crt
## Lembre de instalar o prettier

## Faça PR sempre que for subir alguma alteração

## Utilize o `git pull --all` e `git rebase` para atualizar a sua branch

## Faça Squash and Marge

## Não faça commits direto na main

## Observe se há algum arquivo vazio no seu PR, pode apagar o trabalho feito.

## Marque pelo menos 1 request review 

## Utilize bons nomes para o PR e assine para sabermos mapear caso dê algo errado.