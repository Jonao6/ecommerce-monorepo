FROM postgres:15-alpine

ENV POSTGRES_USER=admin \
    POSTGRES_PASSWORD=ecommerce_123 \
    POSTGRES_DB=ecommerce

COPY infra/postgres/initdb.d /docker-entrypoint-initdb.d
RUN chmod +x /docker-entrypoint-initdb.d/*.sh

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD ["/usr/local/bin/healthcheck.sh"]

