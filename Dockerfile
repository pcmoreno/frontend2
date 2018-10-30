FROM psybizz-registry.githost.io/containers/nginx-frontend:latest
MAINTAINER PsyBizz <development@psybizz.eu>

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /src/public

# make sure build output is copied to the container
# we expect the pipeline to make the build
ADD ./web /src/public/web
ADD ./index.html /src/public/index.html
ADD ./service-worker.js /src/public/service-worker.js
ADD ./favicon.ico /src/public/favicon.ico

# give nginx user permissions
CMD chown -R nginx:nginx .

# expose ports
EXPOSE 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]