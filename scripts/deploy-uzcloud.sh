#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

: "${UZCLOUD_FTP_HOST:=89.126.223.196}"
: "${UZCLOUD_FTP_USER:=user1110}"
: "${UZCLOUD_FTP_REMOTE_DIR:=www/tsmukids.uz}"

if [[ -z "${UZCLOUD_FTP_PASSWORD:-}" ]]; then
  echo "Set UZCLOUD_FTP_PASSWORD before running this script." >&2
  exit 1
fi

echo "Building static export..."
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://tsmukids.uz}" npm run build

cat > out/.htaccess <<'HT'
RewriteEngine On
RewriteRule ^$ /ru/ [R=301,L]
ErrorDocument 404 /404.html
HT

echo "Uploading to UZCLOUD..."
export LFTP_PASSWORD="$UZCLOUD_FTP_PASSWORD"
lftp -u "$UZCLOUD_FTP_USER","$LFTP_PASSWORD" "ftp://${UZCLOUD_FTP_HOST}:21" -e "
set ftp:ssl-allow no
set net:timeout 120
set net:max-retries 10
set net:reconnect-interval-base 5
set mirror:parallel-transfer-count 4
mirror -R --verbose --exclude-glob .DS_Store --exclude-glob ._* --delete out ${UZCLOUD_FTP_REMOTE_DIR}
mirror -R --verbose --exclude-glob .DS_Store --delete server/api ${UZCLOUD_FTP_REMOTE_DIR}/api
mkdir -p ${UZCLOUD_FTP_REMOTE_DIR}/data
put -O ${UZCLOUD_FTP_REMOTE_DIR}/data server/data/.htaccess
put -O ${UZCLOUD_FTP_REMOTE_DIR}/data server/data/index.php
# Initial CMS data (will not overwrite if already present — use FORCE_SITE_DATA=1)
$(if [[ "${FORCE_SITE_DATA:-}" == "1" ]]; then echo "put -O ${UZCLOUD_FTP_REMOTE_DIR}/data server/data/site.json"; echo "put -O ${UZCLOUD_FTP_REMOTE_DIR}/data server/data/appointments.json"; else echo "glob -a echo ${UZCLOUD_FTP_REMOTE_DIR}/data/site.json || put -O ${UZCLOUD_FTP_REMOTE_DIR}/data server/data/site.json"; echo "glob -a echo ${UZCLOUD_FTP_REMOTE_DIR}/data/appointments.json || put -O ${UZCLOUD_FTP_REMOTE_DIR}/data server/data/appointments.json"; fi)
bye
"

echo "Done."
echo "  https://tsmukids.uz/ru/"
echo "  https://tsmukids.uz/admin/"
echo "  https://tsmukids.uz/api/index.php?r=site"
