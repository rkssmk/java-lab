#!/usr/bin/env bash
set -Eeuo pipefail

: "${DB_USERNAME:?DB_USERNAME is required}"
: "${DB_PASSWORD:?DB_PASSWORD is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"

# The official Postgres entrypoint runs this as the initial database administrator.
# The application receives a separate non-superuser role.
psql --set=ON_ERROR_STOP=1 \
  --set=app_user="$DB_USERNAME" \
  --set=app_password="$DB_PASSWORD" \
  --set=app_db="$POSTGRES_DB" \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" <<'SQL'
CREATE ROLE :"app_user" LOGIN PASSWORD :'app_password';
GRANT CONNECT ON DATABASE :"app_db" TO :"app_user";
GRANT USAGE, CREATE ON SCHEMA public TO :"app_user";
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
SQL
