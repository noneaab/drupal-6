#!/bin/bash
find . -maxdepth 1 -name '*.tar.gz' -exec tar -zxf {} \;
find . -maxdepth 1 -name '*.tar.gz' -exec mv {} _extracted/ \;
