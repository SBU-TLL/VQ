import sys
import json
import os

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

with open(sys.argv[1]) as x: f = x.read()
data=json.loads(f)
for i in range(len(data['watchData'])):
	data['watchData'][i]=1
	
f = open(sys.argv[1], "w")
f.write(json.dumps(data))
f.close()

