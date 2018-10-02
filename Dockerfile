FROM psybizz-registry.githost.io/containers/nginx-frontend:latest
MAINTAINER PsyBizz <development@psybizz.eu>

WORKDIR /src/public

# make sure build output is copied to the container
# we expect the pipeline to make the build
ADD ./web /src/public
ADD ./index.html /src/public/index.html
ADD ./service-worker.js /src/public/service-worker.js
ADD ./favicon.ico /src/public/favicon.ico

# give nginx user permissions
CMD chown -R nginx:nginx ./
