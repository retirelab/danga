"""Run against a throwaway PHP server. No NAS access or real prices are used."""
import http.cookiejar, json, os, pathlib, re, secrets, socket, subprocess, sys, tempfile, time, urllib.request, urllib.error

root = pathlib.Path(__file__).resolve().parents[1]
php = sys.argv[1] if len(sys.argv)>1 else 'php'
count = 0
def check(condition):
    global count
    assert condition
    count += 1
with tempfile.TemporaryDirectory(prefix='danga-test-') as directory:
    private=pathlib.Path(directory)
    pin=f'{secrets.randbelow(10000):04d}'
    hashed=subprocess.run([php,'-r', 'echo password_hash(trim(stream_get_contents(STDIN)),PASSWORD_DEFAULT);'],input=pin,text=True,capture_output=True,check=True).stdout
    (private/'config.php').write_text("<?php return ['pin_hash'=>'"+hashed+"','allow_http_local_test'=>true];")
    (private/'catalog.json').write_text((root/'private-template/catalog.example.json').read_text())
    sock=socket.socket();sock.bind(('127.0.0.1',0));port=sock.getsockname()[1];sock.close()
    env=dict(os.environ,DANGA_PRIVATE_DIR=directory)
    server=subprocess.Popen([php,'-S',f'127.0.0.1:{port}','-t',str(root/'public')],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    def client(): return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    browser=client()
    def request(path, data=None, token=None, opener=None):
        headers={} if token is None else {'X-CSRF-Token':token}
        req=urllib.request.Request(f'http://127.0.0.1:{port}/'+path,data=json.dumps(data).encode() if data is not None else None,headers=headers)
        try: r=(opener or browser).open(req)
        except urllib.error.HTTPError as e:r=e
        return r.code,r.read().decode(),r.headers
    try:
        for _ in range(50):
            try:request('api.php?action=status');break
            except urllib.error.URLError:time.sleep(.1)
        code,body,headers=request('api.php?action=catalog');check(code==401 and 'DEMO' not in body)
        check(request('app-shell.php')[0]==401)
        code,body,headers=request('index.php');check(code==200 and 'id="pin"' in body)
        check('no-store' in headers['Cache-Control'])
        token=json.loads(request('api.php?action=status')[1])['csrf']
        check(request('api.php?action=login',{'pin':pin})[0]==403)
        check(request('api.php?action=login',{'pin':pin},token)[0]==200)
        code,body,headers=request('api.php?action=catalog');check(code==200 and json.loads(body)['demo'])
        check('no-store' in headers['Cache-Control'])
        code,body,_=request('index.php');check(code==200 and 'app.js' in body)
        check(request('api.php?action=catalog',opener=client())[0]==401)
        token=json.loads(request('api.php?action=status')[1])['csrf']
        check(request('api.php?action=logout',{},token)[0]==200)
        check(request('api.php?action=catalog')[0]==401)
        wrong='0000' if pin!='0000' else '0001'
        for i in range(5):
            attacker=client()
            token=json.loads(request('api.php?action=status',opener=attacker)[1])['csrf']
            check(request('api.php?action=login',{'pin':wrong},token,attacker)[0]==(429 if i==4 else 401))
        token=json.loads(request('api.php?action=status')[1])['csrf']
        check(request('api.php?action=login',{'pin':pin},token)[0]==429)
        (private/'state/login-attempts.json').write_text('{"attempts":[],"blocked_until":0}')
        check(request('api.php?action=login',{'pin':pin},token)[0]==200)
        (private/'catalog.json').write_text('{broken')
        check(request('api.php?action=catalog')[0]==503)
        sample=json.loads((root/'private-template/catalog.example.json').read_text())
        sample['items'][0]['price_krw']=1.5
        (private/'catalog.json').write_text(json.dumps(sample))
        check(request('api.php?action=catalog')[0]==503)
        # Expired sessions cannot access the catalog even with the cookie retained.
        for session in (private/'state/sessions').glob('sess_*'):
            text=session.read_text()
            session.write_text(re.sub(r'last_seen\|i:[0-9]+;', 'last_seen|i:1;', text))
        check(request('api.php?action=catalog')[0]==401)
        token=json.loads(request('api.php?action=status')[1])['csrf']
        check(request('api.php?action=login',{'pin':pin},token)[0]==200)
        # Existing sessions must be revoked when the PIN hash is changed.
        (private/'config.php').write_text("<?php return ['pin_hash'=>'"+hashed+"changed','allow_http_local_test'=>true];")
        check(request('api.php?action=catalog')[0]==401)
        print(f'PASS: {count} integration checks (auth, CSRF, logout, global lockout, catalog validation, session revocation)')
    finally:server.terminate();server.wait()
