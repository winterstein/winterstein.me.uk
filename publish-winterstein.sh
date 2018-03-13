#!/bin/bash

#publish-winterstein.sh website

rsync -rhP web/* winterwell@bester.soda.sh:/home/winterwell/winterstein.me/web/
