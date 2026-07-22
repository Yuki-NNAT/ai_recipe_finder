#!/bin/bash
# setup_embed.sh - Cai dat va khoi dong job embed tren EC2 Ubuntu 24.04 (chay 1 lan)
set -e

echo "== [1/4] Cai dat he thong =="
sudo apt-get update -y
sudo apt-get install -y docker.io python3-pip tmux

echo "== [2/4] Khoi dong pgvector (Docker) =="
sudo docker rm -f pgvector 2>/dev/null || true
sudo docker run -d --name pgvector \
  -e POSTGRES_PASSWORD=recipe123 -e POSTGRES_DB=recipedb \
  -p 5432:5432 -v pgdata:/var/lib/postgresql/data \
  pgvector/pgvector:pg16

echo "== [3/4] Cai thu vien Python (torch ban CPU) =="
pip3 install --break-system-packages torch --index-url https://download.pytorch.org/whl/cpu
pip3 install --break-system-packages "psycopg[binary]" pgvector pymysql sentence-transformers

echo "== Cho Postgres san sang... =="
until sudo docker exec pgvector pg_isready -U postgres >/dev/null 2>&1; do sleep 2; done

echo "== [4/4] Khoi dong job trong tmux =="
tmux kill-session -t embed 2>/dev/null || true
tmux new-session -d -s embed 'python3 sync_bulk.py 2>&1 | tee embed.log'

echo ""
echo "XONG! Job dang chay ngam trong tmux."
echo "  Xem tien do :  tmux attach -t embed    (roi Ctrl+B, tha ra bam D de thoat, job van chay)"
echo "  Hoac xem log:  tail -f embed.log"
