sudo apt-get update

sudo apt-get -y install curl
sudo apt-get -y install git

sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install
npm build

sudo npm install -g http-server