FROM nginx:alpine

ADD ./config/nginx.conf /etc/nginx/conf.d/default.conf