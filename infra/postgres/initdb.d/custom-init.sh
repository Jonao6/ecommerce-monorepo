for f in /docker-entrypoint-initdb.d/*.sql; do
    echo "Executando $f"
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
done

if [ -d "/migrations" ]; then
    for f in /migrations/*.sql; do
        echo "Aplicando migração $f"
        psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
    done
fi