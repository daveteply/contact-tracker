FROM dpage/pgadmin4:latest

USER root

RUN mkdir -p /pgadmin4 \
    && touch /pgadmin4/servers.json \
    && chown -R 5050:5050 /pgadmin4

# Return to non-root (entrypoint will switch users correctly)
USER 5050
