#!/bin/sh
set -e
FLAG_FILE="/configured"
TARGET_DIR="/etc/nginx/html"
replace_vars () {
  ENV_VARS=\'$(awk 'BEGIN{for(v in ENVIRON) print "$"v}')\'
  # В Angular ищем плейсхолдеры в main-файлах
  for f in "$TARGET_DIR"/main*.js; do
    # envsubst заменяет в файлах плейсхолдеры на значения из переменных окружения
    echo "$(envsubst "$ENV_VARS" < "$f")" > "$f"
  done
}
compress () {
  for i in $(find "$TARGET_DIR" | grep -E "\.css$|\.html$|\.js$|\.svg$|\.txt$|\.ttf$"); do
    # Используем максимальную степень сжатия
    gzip -9kf "$i" && brotli -fZ "$i"
  done
}
if [ "$1" = 'nginx' ]; then
  # Флаг нужен, чтобы выполнить скрипт только при самом первом запуске
  if [ ! -e "$FLAG_FILE" ]; then
    echo "Running init script"
    echo "Replacing env vars"
    replace_vars
    echo "Compressing files"
    compress
    touch $FLAG_FILE
    echo "Done"
  fi
fi
exec "$@"
