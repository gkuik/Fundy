ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk add --no-cache nginx

# Copy data for add-on
COPY run.sh /
COPY www /www
COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod a+x /run.sh

CMD [ "/run.sh" ]