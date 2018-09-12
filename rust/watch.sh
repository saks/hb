#!/bin/sh
while inotifywait -e modify ./src; do
  clear
  make
done
