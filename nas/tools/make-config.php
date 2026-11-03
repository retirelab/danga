<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$directory = $argv[1] ?? '/volume1/danga-private';
if (file_exists($directory.'/config.php')) { fwrite(STDERR,"config.php already exists; not overwritten.\n"); exit(1); }
fwrite(STDERR,"Enter a 4-digit PIN (do not put it in command arguments): ");
$tty = function_exists('shell_exec') ? shell_exec('stty -g 2>/dev/null') : null;
if ($tty) shell_exec('stty -echo');
try { $pin = trim(fgets(STDIN) ?: ''); }
finally { if ($tty) shell_exec('stty '.escapeshellarg(trim($tty))); fwrite(STDERR,"\n"); }
if (!preg_match('/^[0-9]{4}$/D',$pin)) {fwrite(STDERR,"PIN must be exactly four digits.\n");exit(1);}
if (!is_dir($directory) && !mkdir($directory,0700,true)) exit(1);
$hash=password_hash($pin,PASSWORD_DEFAULT);
unset($pin);
$content="<?php\nreturn ['pin_hash'=>".var_export($hash,true).",'allow_http_local_test'=>false];\n";
$file=fopen($directory.'/config.php','x');
if (!$file) exit(1);
fwrite($file,$content);fclose($file);chmod($directory.'/config.php',0600);
fwrite(STDERR,"Private config created. Grant the Web Station PHP user read access and state-directory write access in DSM.\n");
