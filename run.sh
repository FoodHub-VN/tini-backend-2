cd AI
sudo docker build -t lvai2 .
sudo docker-compose up -d
cd ..
docker build -t lv2 .
sudo docker-compose up