#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# ThesisFrame — Script de déploiement sur Infomaniak Cloud Server
# ═══════════════════════════════════════════════════════════════════════════
# Prérequis :
#   - Ubuntu 22.04+ avec Docker installé
#   - Un domaine pointant vers l'IP du serveur (A record)
#   - Git installé
#
# Utilisation :
#   chmod +x docker/deploy.sh
#   ./docker/deploy.sh                  # première installation
#   ./docker/deploy.sh --update         # mise à jour depuis Git
#   ./docker/deploy.sh --backup         # sauvegarder la base SQLite
#   ./docker/deploy.sh --logs           # voir les logs en temps réel
#   ./docker/deploy.sh --status         # état des conteneurs
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────
PROJECT_DIR="/opt/thesisframe"
BACKUP_DIR="/opt/thesisframe-backups"
DOMAIN=""  # laisser vide pour HTTP seul, ou "thesisframe.example.ch"

# ─── Couleurs ─────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERR]${NC}   $*"; exit 1; }

# ─── Prérequis ────────────────────────────────────────────────────
check_prereqs() {
    info "Vérification des prérequis..."
    command -v docker >/dev/null 2>&1 || error "Docker n'est pas installé. Exécutez : curl -fsSL https://get.docker.com | sh"
    command -v docker compose >/dev/null 2>&1 || error "Docker Compose V2 n'est pas disponible"
    command -v git >/dev/null 2>&1 || error "Git n'est pas installé. Exécutez : apt install git"
    docker info >/dev/null 2>&1 || error "Docker daemon ne tourne pas. Exécutez : systemctl start docker"
    ok "Tous les prérequis sont satisfaits"
}

# ─── Installation initiale ────────────────────────────────────────
first_install() {
    info "Installation initiale de ThesisFrame..."
    check_prereqs

    # Cloner le dépôt
    if [ -d "$PROJECT_DIR/.git" ]; then
        warn "Le répertoire $PROJECT_DIR existe déjà (dépôt Git)."
        read -p "Voulez-vous le supprimer et recloner ? [o/N] " -n 1 -r
        echo
        [[ ! $REPLY =~ ^[Oo]$ ]] && error "Opération annulée."
        rm -rf "$PROJECT_DIR"
    fi

    info "Clonage du dépôt Git dans $PROJECT_DIR..."
    git clone https://github.com/VOTRE-USER/thesisframe.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"

    # Configurer .env.production
    if [ ! -f .env.production ]; then
        cp docker/.env.production .env.production
        warn "⚠  Fichier .env.production créé. Éditez-le AVANT de lancer :"
        warn "   nano $PROJECT_DIR/.env.production"
        warn "   (remplissez ZAI_BASE_URL et ZAI_API_KEY au minimum)"
    fi

    # Configurer le domaine dans Caddyfile
    if [ -n "$DOMAIN" ]; then
        sed -i "s/thesisframe.votre-domaine.ch/${DOMAIN}/g" docker/Caddyfile
        ok "Domaine configuré : $DOMAIN (TLS automatique via Let's Encrypt)"
    else
        # Activer le mode HTTP seul
        sed -i '/^thesisframe\./,/^}/s/^/#/' docker/Caddyfile
        sed -i 's/# :80 {/:80 {/' docker/Caddyfile
        sed -i '/^# \treverse_proxy/s/# \t/\t/' docker/Caddyfile
        sed -i '/^# \theader_up/s/# \t/\t/' docker/Caddyfile
        sed -i '/^# \t@search/s/# \t/\t/' docker/Caddyfile
        sed -i '/^# \thandle/s/# \t/\t/' docker/Caddyfile
        sed -i '/^# \turi/s/# \t/\t/' docker/Caddyfile
        warn "Aucun domaine configuré — mode HTTP seul (port 80)"
    fi

    # Initialiser la base SQLite
    mkdir -p db
    touch db/custom.db

    # Lancer
    info "Construction et démarrage des conteneurs..."
    docker compose up -d --build

    # Attendre que l'app soit prête
    info "Attente du démarrage de l'application (30s)..."
    sleep 30

    # Vérifier
    if docker compose ps | grep -q "healthy\|running"; then
        ok "ThesisFrame est en ligne !"
        if [ -n "$DOMAIN" ]; then
            echo -e "  → ${GREEN}https://${DOMAIN}${NC}"
        else
            echo -e "  → ${GREEN}http://$(curl -s ifconfig.me 2>/dev/null || echo '<IP_DU_VPS>')${NC}"
        fi
    else
        error "Le démarrage a échoué. Consultez les logs : docker compose logs -f"
    fi
}

# ─── Mise à jour ──────────────────────────────────────────────────
update() {
    info "Mise à jour de ThesisFrame..."
    cd "$PROJECT_DIR"

    # Sauvegarder la base avant la mise à jour
    backup

    git pull origin main

    info "Reconstruction des conteneurs..."
    docker compose up -d --build

    info "Nettoyage des images obsolètes..."
    docker image prune -f

    ok "Mise à jour terminée !"
}

# ─── Sauvegarde SQLite ────────────────────────────────────────────
backup() {
    info "Sauvegarde de la base de données..."
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/thesis_${TIMESTAMP}.db"

    # Copier le fichier SQLite depuis le volume Docker
    docker compose cp app:/app/data/thesis.db "$BACKUP_FILE" 2>/dev/null || \
        warn "Impossible de copier la base (conteneur arrêté ou volume vide)"

    # Compresser les anciennes sauvegardes (garder les 10 dernières)
    ls -t "$BACKUP_DIR"/thesis_*.db 2>/dev/null | tail -n +11 | xargs -r gzip

    ok "Sauvegarde : $BACKUP_FILE"
}

# ─── Logs ─────────────────────────────────────────────────────────
logs() {
    docker compose logs -f --tail=100 "$@"
}

# ─── Statut ───────────────────────────────────────────────────────
status() {
    echo ""
    docker compose ps
    echo ""
    info "Volume de la base de données :"
    docker volume inspect thesisframe_db 2>/dev/null | grep -A2 Mountpoint || echo "  (volume non créé)"
    echo ""
    info "Espace disque :"
    df -h / | tail -1
}

# ─── Aide ─────────────────────────────────────────────────────────
usage() {
    echo ""
    echo -e "${BLUE}ThesisFrame — Déploiement Infomaniak VPS${NC}"
    echo ""
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes :"
    echo "  (aucune)     Installation initiale"
    echo "  --update     Mettre à jour depuis Git + reconstruire"
    echo "  --backup     Sauvegarder la base SQLite"
    echo "  --logs       Voir les logs en temps réel"
    echo "  --status     État des conteneurs + espace disque"
    echo "  --stop       Arrêter les conteneurs"
    echo "  --start      Démarrer les conteneurs"
    echo "  --restart    Redémarrer les conteneurs"
    echo "  --help       Afficher cette aide"
    echo ""
    echo "Configuration :"
    echo "  Modifier PROJECT_DIR et DOMAIN en tête de ce script"
    echo "  Éditer .env.production pour les clés API"
    echo ""
}

# ─── Router de commandes ──────────────────────────────────────────
case "${1:-}" in
    --update)  update ;;
    --backup)  backup ;;
    --logs)    shift; logs "$@" ;;
    --status)  status ;;
    --stop)    cd "$PROJECT_DIR" && docker compose down ;;
    --start)   cd "$PROJECT_DIR" && docker compose up -d ;;
    --restart) cd "$PROJECT_DIR" && docker compose restart ;;
    --help|-h) usage ;;
 "")          first_install ;;
 *)           error "Commande inconnue : $1. Utilisez --help" ;;
esac
