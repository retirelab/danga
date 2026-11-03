"""Cookie-free widget auth and protected PDF tests; disposable fake data only."""
import hashlib, json, os, pathlib, secrets, socket, subprocess, sys, tempfile, time, urllib.request, urllib.error
root=pathlib.Path(__file__).resolve().parents[1]
php=sys.argv[1] if len(sys.argv)>1 else 'php'
count=0
def check(condition):
    global count
    assert condition
    count+=1
with tempfile.TemporaryDirectory(prefix='danga-service-') as d:
    private=pathlib.Path(d);(private/'pdfs').mkdir();pin=f'{secrets.randbelow(10000):04d}'
    hashed=subprocess.run([php,'-r','echo password_hash(trim(stream_get_contents(STDIN)),PASSWORD_DEFAULT);'],input=pin,text=True,capture_output=True,check=True).stdout
    sock=socket.socket();sock.bind(('127.0.0.1',0));port=sock.getsockname()[1];sock.close();origin=f'http://127.0.0.1:{port}'
    config="<?php return ['pin_hash'=>'"+hashed+"','allow_http_local_test'=>true,'service_origin'=>'"+origin+"'];"
    (private/'config.php').write_text(config)
    pdf=b'%PDF-1.4\n% test fixture, not a price list\n';(private/'pdfs/test.pdf').write_bytes(pdf);digest=hashlib.sha256(pdf).hexdigest()
    manifest={'documents':[{'id':'test','title':'Fictional PDF','file':'test.pdf','pages':1,'sha256':digest}]}
    (private/'documents.json').write_text(json.dumps(manifest))
    catalog=json.loads((root/'private-template/catalog.example.json').read_text());item=catalog['items'][0];item.update(document_id='test',source_sha256=digest,verified=True)
    (private/'catalog.json').write_text(json.dumps(catalog))
    server=subprocess.Popen([php,'-S',f'127.0.0.1:{port}','-t',str(root/'public')],env=dict(os.environ,DANGA_PRIVATE_DIR=d),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    def req(action,token='',body=None,origin_header=origin):
        headers={'Origin':origin_header}
        if token:headers['Authorization']='Bearer '+token
        if body is not None:headers['Content-Type']='application/json'
        request=urllib.request.Request(origin+'/service.php?action='+action,headers=headers,data=json.dumps(body).encode() if body is not None else None)
        try:r=urllib.request.urlopen(request)
        except urllib.error.HTTPError as e:r=e
        return r.code,r.read(),r.headers
    try:
        for _ in range(50):
            try:req('catalog');break
            except urllib.error.URLError:time.sleep(.1)
        check(req('catalog')[0]==401);check(req('pdf&id=test')[0]==401)
        check(req('login',body={'pin':pin},origin_header='https://evil.example')[0]==403)
        code,data,headers=req('login',body={'pin':pin});check(code==200);check('Set-Cookie' not in headers)
        token=json.loads(data)['token'];check(len(token)==64)
        code,data,headers=req('catalog',token);check(code==200 and 'no-store' in headers['Cache-Control']);check('file' not in json.loads(data)['documents'][0])
        check(req('catalog',token,origin_header='https://evil.example')[0]==403)
        code,data,headers=req('pdf&id=test',token);check(code==200 and data==pdf);check(headers['Content-Type']=='application/pdf');check('no-store' in headers['Cache-Control'])
        check(req('pdf&id=../../config',token)[0]==404)
        check(req('select&id=demo-1&revision=DEMO-001&price=1000000',token)[0]==200)
        check(req('select&id=demo-1&revision=old&price=1000000',token)[0]==409)
        check(req('select&id=demo-1&revision=DEMO-001&price=1',token)[0]==409)
        check(req('select&id=demo-2&revision=DEMO-001&price=1200000',token)[0]==409)
        (private/'pdfs/test.pdf').write_bytes(pdf+b'changed');check(req('pdf&id=test',token)[0]==409);check(req('select&id=demo-1&revision=DEMO-001&price=1000000',token)[0]==409)
        (private/'pdfs/test.pdf').write_bytes(pdf)
        manifest['documents'][0]['file']='../config.php';(private/'documents.json').write_text(json.dumps(manifest));check(req('pdf&id=test',token)[0]==404)
        manifest['documents'][0]['file']='test.pdf';(private/'documents.json').write_text(json.dumps(manifest))
        check(req('logout',token,body={})[0]==200);check(req('catalog',token)[0]==401)
        token=json.loads(req('login',body={'pin':pin})[1])['token'];record=private/'state/tokens'/ (hashlib.sha256(token.encode()).hexdigest()+'.json');state=json.loads(record.read_text());state['last_seen']=1;state['created']=1;record.write_text(json.dumps(state));check(req('catalog',token)[0]==200)
        state.pop('tab_session');record.write_text(json.dumps(state));check(req('catalog',token)[0]==401)
        token=json.loads(req('login',body={'pin':pin})[1])['token'];(private/'config.php').write_text(config.replace(hashed,hashed+'changed'));check(req('catalog',token)[0]==401);(private/'config.php').write_text(config)
        wrong='0000' if pin!='0000' else '0001'
        for i in range(5):check(req('login',body={'pin':wrong})[0]==(429 if i==4 else 401))
        check(req('login',body={'pin':pin})[0]==429)
        # A cookie client shares the same global lockout with the embedded client.
        jar=urllib.request.HTTPCookieProcessor();opener=urllib.request.build_opener(jar)
        status=json.load(opener.open(origin+'/api.php?action=status'))
        r=urllib.request.Request(origin+'/api.php?action=login',data=json.dumps({'pin':pin}).encode(),headers={'X-CSRF-Token':status['csrf']})
        try:opener.open(r);check(False)
        except urllib.error.HTTPError as e:check(e.code==429)
        print(f'PASS: {count} cookie-free API/PDF checks')
    finally:server.terminate();server.wait()
