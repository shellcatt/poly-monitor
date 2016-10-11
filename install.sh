#!/bin/sh

echo "installing dependencies..."
[ -x /usr/bin/nodejs ] || sudo apt-get install node
[ -x /usr/bin/bower ] ||sudo npm install -g bower

echo "installing polymer components..."
[ -f bowerrc ] && mv bowerrc .bowerrc
bower install
npm install director

echo "preparing apache..."
sudo a2enmod proxy proxy_http
sudo service apache2 reload