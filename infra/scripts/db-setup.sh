#!/bin/bash
set -e

DOCKER_COMPOSE_FILE="../docker-compose.yml"  

echo "Iniciando banco de dados PostgreSQL..."
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d db

echo "Aguardando inicialização do PostgreSQL (10 segundos)..."
sleep 10

DB_CONTAINER_ID=$(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q db)
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$DB_CONTAINER_ID")

if [ "$HEALTH_STATUS" != "healthy" ]; then
  echo "Container não está healthy! Status: $HEALTH_STATUS"
  echo "Exibindo logs do container:"
  docker-compose -f "$DOCKER_COMPOSE_FILE" logs db
  exit 1
fi

echo "migrações do Prisma..."
npx prisma migrate deploy --schema=../prisma/schema.prisma

echo "OK"#!/bin/bash
set -e

DOCKER_COMPOSE_FILE="../docker-compose.yml"

echo "Iniciando banco de dados PostgreSQL..."
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d db

echo "Aguardando inicialização do PostgreSQL (10 segundos)..."
sleep 10

DB_CONTAINER_ID=$(docker-compose -f "$DOCKER_COMPOSE_FILE" ps -q db)
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$DB_CONTAINER_ID")

if [ "$HEALTH_STATUS" != "healthy" ]; then
  echo "Container não está healthy! Status: $HEALTH_STATUS"
  echo "Exibindo logs do container:"
  docker-compose -f "$DOCKER_COMPOSE_FILE" logs db
  exit 1
fi

echo "Aplicando migrações do Prisma..."
npx prisma migrate deploy --schema=../prisma/schema.prisma

echo "OK"