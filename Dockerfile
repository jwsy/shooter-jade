FROM nginxinc/nginx-unprivileged

EXPOSE 8080

COPY index.html /usr/share/nginx/html
COPY scenes /usr/share/nginx/html/scenes
COPY sprites /usr/share/nginx/html/sprites
