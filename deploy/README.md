# Miloševac production deployment

Produkcija koristi jedan domen (`https://milosevac.com`) i jedan Git monorepo:

- React build iz `dist/` servira Nginx.
- Laravel u `backend/` obrađuje `/api`, admin/autorske rute, storage, sitemapove, RSS i health check.
- Kod se objavljuje kroz release direktorije; baza, `.env` i uploadovane slike ostaju u `shared/`.

## 1. Inventar postojećeg servera

Na Hetzner server prvo kopirati i pokrenuti samo read-only inventar:

```bash
bash deploy/server/inventory.sh | tee ~/milosevac-server-inventory.txt
```

Provjeriti postojeće Nginx sajtove, PHP-FPM poolove, MySQL/MariaDB, Supervisor, Certbot i zauzete portove prije instalacije ili izmjene zajedničkih servisa.

Potrebni runtime alati:

- Nginx
- PHP-FPM i PHP CLI `>=8.2` sa `pdo_mysql`, `mbstring`, `xml`, `curl`, `gd`, `zip`
- MySQL ili MariaDB
- Composer 2
- Node.js 20 i npm
- Git, rsync, Supervisor, Certbot

## 2. Server direktoriji i korisnik

Primjer koristi zasebnog Linux korisnika `milosevac`:

```bash
sudo adduser --disabled-password --gecos "" milosevac
sudo usermod -aG www-data milosevac
sudo install -d -o milosevac -g www-data -m 2775 \
  /var/www/milosevac/releases \
  /var/www/milosevac/shared/backend/storage/app/public \
  /var/www/milosevac/shared/backend/storage/app/private \
  /var/www/milosevac/shared/backend/storage/framework/cache/data \
  /var/www/milosevac/shared/backend/storage/framework/sessions \
  /var/www/milosevac/shared/backend/storage/framework/views \
  /var/www/milosevac/shared/backend/storage/logs \
  /var/www/milosevac/shared/import \
  /var/backups/milosevac
```

Kopirati izvršne skripte iz repozitorija:

```bash
sudo install -o milosevac -g www-data -m 0755 deploy/server/deploy.sh /var/www/milosevac/deploy.sh
sudo install -o milosevac -g www-data -m 0755 deploy/server/rollback.sh /var/www/milosevac/rollback.sh
sudo install -o milosevac -g www-data -m 0755 deploy/server/backup.sh /var/www/milosevac/backup.sh
```

Server korisnik mora imati read-only deploy key za GitHub repozitorij. Za restart queue workera dozvoliti samo potrebnu `supervisorctl restart milosevac-worker:*` sudo komandu.

## 3. MySQL i produkcijski env

Kreirati zasebnu bazu i korisnike:

```sql
CREATE DATABASE milosevac CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'milosevac'@'127.0.0.1' IDENTIFIED BY 'CHANGE_APP_PASSWORD';
GRANT ALL PRIVILEGES ON milosevac.* TO 'milosevac'@'127.0.0.1';

CREATE USER 'milosevac_backup'@'127.0.0.1' IDENTIFIED BY 'CHANGE_BACKUP_PASSWORD';
GRANT SELECT, SHOW VIEW, TRIGGER, EVENT, LOCK TABLES ON milosevac.* TO 'milosevac_backup'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Kopirati i popuniti env fajlove:

```bash
sudo -u milosevac cp deploy/env/backend.env.example /var/www/milosevac/shared/backend/.env
sudo -u milosevac cp deploy/env/backup.env.example /var/www/milosevac/shared/backup.env
sudo -u milosevac cp deploy/env/mysql-backup.cnf.example /var/www/milosevac/shared/mysql-backup.cnf
sudo chmod 600 /var/www/milosevac/shared/backend/.env /var/www/milosevac/shared/mysql-backup.cnf
```

Generisati `APP_KEY` lokalno ili kroz privremeni Laravel checkout i upisati ga u shared `.env`. Produkcija ne pokreće `db:seed`.

## 4. Nginx, PHP-FPM, Supervisor i cron

Primjere instalirati tek nakon pregleda postojećih konfiguracija:

```bash
sudo cp deploy/php-fpm/milosevac.conf.example /etc/php/8.2/fpm/pool.d/milosevac.conf
sudo cp deploy/nginx/milosevac.conf.example /etc/nginx/sites-available/milosevac.conf
sudo ln -s /etc/nginx/sites-available/milosevac.conf /etc/nginx/sites-enabled/milosevac.conf
sudo cp deploy/supervisor/milosevac-worker.conf.example /etc/supervisor/conf.d/milosevac-worker.conf
sudo cp deploy/cron/milosevac.example /etc/cron.d/milosevac

sudo php-fpm8.2 -t
sudo nginx -t
sudo supervisorctl reread
sudo supervisorctl update
```

Prvi put koristiti `staging.milosevac.com`: kopirati Nginx konfiguraciju, promijeniti `server_name` i koristiti odvojeni `APP_ROOT=/var/www/milosevac-staging`. Tek nakon smoke testa aktivirati glavni domen i Certbot:

```bash
sudo certbot --nginx -d milosevac.com -d www.milosevac.com
```

## 5. Prvi deployment i prenos podataka

Prvi release se pokreće ručno kao korisnik `milosevac`:

```bash
sudo -u milosevac /var/www/milosevac/deploy.sh main
```

Lokalna SQLite baza i slike ne idu kroz GitHub. Prenijeti ih direktno:

```bash
rsync -avP backend/database/database.sqlite milosevac@SERVER:/var/www/milosevac/shared/import/database.sqlite
rsync -avP backend/storage/app/public/ milosevac@SERVER:/var/www/milosevac/shared/backend/storage/app/public/
```

Zatim na serveru prvo uraditi dry-run, pa transfer u praznu migriranu MySQL bazu:

```bash
cd /var/www/milosevac/current/backend
php artisan content:transfer-sqlite /var/www/milosevac/shared/import/database.sqlite --dry-run
php artisan content:transfer-sqlite /var/www/milosevac/shared/import/database.sqlite --force
php artisan users:set-password admin@milosevac.test
```

Ponoviti deployment kako bi React snapshot sadržavao prenesene članke:

```bash
/var/www/milosevac/deploy.sh main
```

Transfer odbija pisanje u neprazne tabele. `--truncate --force` koristiti samo nakon provjerenog backupa i samo kada je namjerno potreban potpuni ponovni transfer.

## 6. GitHub Actions deployment

U GitHub repository settings dodati:

- Repository variable: `DEPLOY_ENABLED=true`
- Secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`

Push na `main` prvo pokreće frontend/backend testove i build. Tek nakon uspjeha SSH poziva `/var/www/milosevac/deploy.sh <commit-sha>`.

Rollback na prethodni release:

```bash
/var/www/milosevac/rollback.sh
```

Ili na određeni release:

```bash
/var/www/milosevac/rollback.sh 20260614T120000Z-deadbeef
```

## 7. Backup i smoke test

Cron svake noći pravi MySQL dump i arhivu uploadovanih slika u `/var/backups/milosevac`. Nedjeljni backup koristi hard link na dnevni fajl. Čuva se 7 dnevnih i 4 sedmična backupa.

Ručno provjeriti backup i restore postupak prije javnog puštanja:

```bash
/var/www/milosevac/backup.sh daily
gzip -t /var/backups/milosevac/daily/database-*.sql.gz
gzip -t /var/backups/milosevac/daily/storage-*.tar.gz
```

Smoke test:

```bash
curl -fsS https://milosevac.com/up
curl -fsS 'https://milosevac.com/api/content?limit=1'
curl -fsS https://milosevac.com/sitemap.xml
curl -I https://milosevac.com/admin
curl -I https://milosevac.com/storage/KNOWN_IMAGE.webp
```

Provjeriti naslovnu, sve vijesti, članak, FK Posavina, admin login/upload, slike, sitemap, robots i feed. Potvrditi i da `.env`, SQLite, XML, backup i log fajlovi vraćaju `403` ili `404`.
