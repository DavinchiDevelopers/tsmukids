#!/usr/bin/env bash
set -euo pipefail
cd /Users/gleb/Documents/Leonid/tsmukids
printf '%s\n' 'RewriteEngine On' 'RewriteRule ^$ /ru/ [R=301,L]' 'ErrorDocument 404 /404.html' > out/.htaccess
: "${LFTP_PASSWORD:?need password}"
lftp -u "user1110,$LFTP_PASSWORD" ftp://89.126.223.196:21 <<'EOF'
set ftp:ssl-allow no
set net:timeout 120
set net:max-retries 8
set mirror:parallel-transfer-count 6
put -O www/tsmukids.uz/data server/data/site.json
mirror -R --verbose --no-empty-dirs --exclude-glob .DS_Store --exclude-glob gallery/** --exclude-glob images/** --exclude-glob napravlenia/** --exclude-glob oborudovanie/** --exclude-glob hero/** --exclude-glob brand/** out www/tsmukids.uz
bye
EOF
echo DEPLOY_OK
