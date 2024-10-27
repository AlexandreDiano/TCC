FROM alpine:3.7
RUN apk add curl

ENTRYPOINT [ "curl -v http://backend:3000/" ]