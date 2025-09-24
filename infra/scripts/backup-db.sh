BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

docker exec commerce-db pg_dump -U admin -d ecommerce > "$BACKUP_DIR/dump_$TIMESTAMP.sql"
gzip "$BACKUP_DIR/dump_$TIMESTAMP.sql"