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

file="${1:?Usage: deploy/restore.sh backups/file.sql.enc}"
[[ -f "$file" && -f "${file}.hmac" ]] || { echo "Backup or HMAC file not found" >&2; exit 1; }
actual="$(openssl dgst -sha256 -hmac "$BACKUP_HMAC_PASSPHRASE" "$file" | awk '{print $NF}')"
expected="$(tr -d '[:space:]' < "${file}.hmac")"
[[ -n "$actual" && "$actual" == "$expected" ]] || { echo "Backup HMAC check failed; refusing restore" >&2; exit 1; }

echo "HMAC verified. Restore target: database '$DB_NAME'. Use an empty test database or a DBA-approved recovery procedure; this script does not drop existing objects."
read -r -p "Type RESTORE to continue: " confirmation
[[ "$confirmation" == "RESTORE" ]] || { echo "Cancelled"; exit 1; }
openssl enc -d -aes-256-cbc -pbkdf2 -iter 250000 -pass env:BACKUP_PASSPHRASE -in "$file" \
  | docker compose exec -T db psql --set ON_ERROR_STOP=on -U "$DB_USERNAME" "$DB_NAME"
echo "Restore stream completed. Verify application health and data consistency."
