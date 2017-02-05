apt-get update

apt-get -y install curl
apt-get -y install git

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
apt-get install -y nodejs

git clone https://github.com/sdfepfl/javascript-boilerplate
cd javascript-boilerplate

npm install

npm start