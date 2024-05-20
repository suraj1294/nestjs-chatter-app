build:
	docker build -t nestjs-chatter-app . --no-cache
start:
	docker run -it --env-file .env --rm -p 3000:3000 nestjs-chatter-app