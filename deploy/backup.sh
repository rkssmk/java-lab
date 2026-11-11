#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi
: "${BACKUP_PASSPHRASE:?Set BACKUP_PASSPHRASE in .env}"
: "${BACKUP_HMAC_PASSPHRASE:?Set BACKUP_HMAC_PASSPHRASE in .env}"
: "${DB_USERNAME:=javalab_app}"
: "${DB_NAME:=javalab}"

backup_dir="./backups"
mkdir -p "$backup_dir"
chmod 700 "$backup_dir"
file="$backup_dir/javalab-$(date -u +%Y%m%dT%H%M%S%N).sql.enc"
tmp="${file}.tmp"
trap 'rm -f "$tmp" "${tmp}.hmac"' EXIT

docker compose exec -T db pg_dump --no-owner --no-acl -U "$DB_USERNAME" "$DB_NAME" \
  | openssl enc -aes-256-cbc -salt -pbkdf2 -iter 250000 \
      -pass env:BACKUP_PASSPHRASE -out "$tmp"
chmod 600 "$tmp"
openssl dgst -sha256 -hmac "$BACKUP_HMAC_PASSPHRASE" "$tmp" | awk '{print $NF}' > "${tmp}.hmac"
chmod 600 "${tmp}.hmac"
mv "$tmp" "$file"
mv "${tmp}.hmac" "${file}.hmac"

# Keep only the latest 7 days locally. A separate approved off-site copy is still required.
find "$backup_dir" -type f \( -name 'javalab-*.sql.enc' -o -name 'javalab-*.sql.enc.hmac' \) -mtime +7 -delete
printf 'Encrypted backup and HMAC created: %s\n' "$file"
