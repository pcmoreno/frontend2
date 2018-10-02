FROM psybizz-registry.githost.io/containers/nginx-frontend:latest
MAINTAINER PsyBizz <development@psybizz.eu>

WORKDIR /src/public

# make sure build output is copied to the container
# we expect the pipeline to make the build
ADD ./web /src/public
