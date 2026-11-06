
whitelist=("users" $0)



containsElement () {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 1; done
  return 0 
}
for i in *
do  containsElement $i "${whitelist[@]}";
notInList=$?
if [ $notInList = 0 ]
then 
cp -r  $i ../vqdev
fi
done
cp .htaccess ../vqdev
if [ ! -d "../vqdev/users" ]; then
mkdir ../vqdev/users
fi
