"""Validate and package only the static files used by this site."""
from pathlib import Path
from html.parser import HTMLParser
import shutil
class Resources(HTMLParser):
 def __init__(self):super().__init__();self.files=set();self.ids=[];self.anchors=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for key in ['src','href']:
   value=a.get(key,'')
   if value.startswith('#'):
    if value[1:]:self.anchors.append(value[1:])
   elif value and not value.startswith(('http:','https:','data:','mailto:')):self.files.add(value)
p=Resources();p.feed(Path('index.html').read_text())
assert len(set(p.ids))==len(p.ids),'Duplicate IDs'
assert all(a in p.ids for a in p.anchors),'Missing anchor target'
for file in p.files:assert Path(file).is_file(),f'Missing resource: {file}'
css=Path('rebrand.css').read_text();assert css.count('{')==css.count('}'),'Unbalanced CSS'
out=Path('dist');out.mkdir(exist_ok=True)
for file in sorted(p.files|{'index.html'}):
 target=out/file;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(file,target)
print(f'Validated unique IDs, anchors, CSS structure and {len(p.files)} linked files. Static output ready.')
