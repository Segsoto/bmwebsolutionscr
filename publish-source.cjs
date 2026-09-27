// Fallback for environments where Sites' bundled workflow scripts are unavailable.
// The short-lived source credential is read from hidden stdin and never stored.
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
let input='';if(process.stdin.isTTY)process.stdin.setRawMode(true);process.stdin.setEncoding('utf8');process.stdin.resume();
console.log('Ready for source credential JSON on stdin (input is hidden).');
process.stdin.on('data',chunk=>{input+=chunk;if(/[\r\n]/.test(input)){process.stdin.pause();if(process.stdin.isTTY)process.stdin.setRawMode(false);try{run(JSON.parse(input.trim()));}catch(e){console.error('Publishing preparation failed:',String(e.message).replace(/art_v2_[^\s]+/g,'[redacted]'));process.exitCode=1;}}});
function run(credential){const env={...process.env,GIT_TERMINAL_PROMPT:'0',GIT_CONFIG_COUNT:'1',GIT_CONFIG_KEY_0:'http.extraHeader',GIT_CONFIG_VALUE_0:'Authorization: Bearer '+credential.token};
const git=(args,auth=false)=>{const r=spawnSync('git',['-c','safe.directory='+__dirname,...args],{cwd:__dirname,encoding:'utf8',env:auth?env:process.env,windowsHide:true});if(r.status!==0)throw new Error((r.stderr||r.stdout||'Git failed').split(credential.token).join('[redacted]'));return r.stdout.trim();};
if(!fs.existsSync(path.join(__dirname,'.git')))git(['init','-b','main']);
const remotes=git(['remote']);if(!remotes.split('\n').includes('origin'))git(['remote','add','origin',credential.remote_url]);
git(['add','dist','generate.cjs','serve.cjs','check.cjs','README.md','.openai/hosting.json']);
if(git(['status','--porcelain']))git(['-c','user.name=Codex','-c','user.email=codex@openai.com','commit','-m','Create bilingual BM Web Solutions redesign']);
git(['push','origin','HEAD:refs/heads/'+credential.branch],true);
const sha=git(['rev-parse','HEAD']);const archive=path.join(__dirname,'..','bmwebsolutionscr-site.tar.gz');
const pack=spawnSync('tar',['-czf',archive,'.openai/hosting.json','dist'],{cwd:__dirname,encoding:'utf8',windowsHide:true});if(pack.status!==0)throw new Error(pack.stderr);
console.log(JSON.stringify({project_id:JSON.parse(fs.readFileSync(path.join(__dirname,'.openai/hosting.json'),'utf8')).project_id,commit_sha:sha,archive}));
}
