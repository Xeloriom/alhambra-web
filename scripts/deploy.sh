#!/bin/bash
# ─────────────────────────────────────────────────────────────
# deploy.sh — Upload deploy/ vers IONOS via SFTP/FTP
# ─────────────────────────────────────────────────────────────

# Charger les variables d'env
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | grep 'FTP_' | xargs)
fi

# Vérifications
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo "❌ Identifiants FTP manquants dans .env.local"
    exit 1
fi

FTP_PATH="${FTP_PATH:-/}"

if [[ "$FTP_HOST" == *"://"* ]]; then
    CONNECT_URL="$FTP_HOST"
else
    CONNECT_URL="ftp://$FTP_HOST"
fi

# ── Auto-commit des sources non commitées (hors deploy/) ──────────────────────
if ! git diff --quiet -- ':!deploy/' || ! git diff --cached --quiet -- ':!deploy/'; then
    echo ""
    echo "📦 Changements source détectés — commit automatique..."
    git add -- ':!deploy/'
    LAST_MSG=$(git log -1 --pretty=%s 2>/dev/null || echo "update")
    git commit -m "chore(deploy): auto-commit before ship — $LAST_MSG" --quiet
    echo "✅ Committé"
fi

# ── Push GitHub — le SHA poussé sera celui écrit dans deploy-info.json ────────
echo ""
echo "📤 Push vers GitHub..."
git push 2>&1 && echo "✅ GitHub synchronisé" || echo "⚠️  Push GitHub échoué"

# ── Écrire deploy-info.json avec les infos du commit courant ──────────────────
COMMIT_HASH=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
COMMIT_SHORT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
COMMIT_MSG=$(git log -1 --pretty=%s 2>/dev/null || echo "unknown")
DEPLOYED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > deploy/deploy-info.json << JSON
{
  "commit": "$COMMIT_HASH",
  "commit_short": "$COMMIT_SHORT",
  "message": $(echo "$COMMIT_MSG" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read().strip()))"),
  "deployed_at": "$DEPLOYED_AT",
  "status": "success"
}
JSON

echo ""
echo "🚀 Déploiement vers IONOS"
echo "   Host   : $CONNECT_URL"
echo "   User   : $FTP_USER"
echo "   Commit : $COMMIT_SHORT — $COMMIT_MSG"
echo ""

# Vérifier que lftp est installé
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp n'est pas installé. Lance : brew install lftp"
    exit 1
fi

lftp -u "$FTP_USER","$FTP_PASS" "$CONNECT_URL" << 'LFTP_EOF' 2>&1 | grep -v "Access failed: Permission denied" | grep -v "Access failed: Failure"
set ssl:verify-certificate false
set sftp:auto-confirm yes
set net:timeout 30
set net:max-retries 3
set ftp:passive-mode true
set mirror:no-empty-dirs true

mirror \
  --reverse \
  --delete \
  --verbose \
  --parallel=4 \
  --exclude-glob 'api-test.php' \
  deploy/ /

quit
LFTP_EOF

echo ""
echo "✅ Deploy terminé — https://www.alhambra-web.com"
