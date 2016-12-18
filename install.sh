apt-get update

apt-get -y install curl
apt-get -y install git

# Node Version Manager - Simple bash script to manage multiple active node.js versions
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash

. $HOME/.nvm/nvm.sh && nvm install node && nvm use node

npm install -g nodemon

git clone https://github.com/sdfepfl/react-express-boilerplate
cd react-express-boilerplate
npm install
npm start
