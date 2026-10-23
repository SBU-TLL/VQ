#!/bin/bash
cd "${0%/*}"
cd "../users/${2}"
ln -s ../${1}/${3} ${4}
