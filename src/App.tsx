import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Upload, Download, Trash2 } from 'lucide-react';

interface VaultFile {
  id: string; name: string; size: string; type: string;
  content: string; createdAt: number;
}

export default function App() {
  const [locked, setLocked]   = useState(true);
  const [input,  setInput]    = useState('');
  const [confirm,setConfirm]  = useState('');
  const [showPwd,setShowPwd]  = useState(false);
  const [isNew,  setIsNew]    = useState(!localStorage.getItem('fs_hash'));
  const [error,  setError]    = useState('');
  const [files,  setFiles]    = useState<VaultFile[]>([]);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input+'fs_salt_v1'));
    const h = Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    if (isNew) {
      if (input.length < 4) { setError('Min 4 characters'); return; }
      if (input !== confirm) { setError("Passwords don\'t match"); return; }
      localStorage.setItem('fs_hash', h);
      setIsNew(false); setLocked(false);
      const d = localStorage.getItem('fs_files'); if(d) setFiles(JSON.parse(d));
    } else {
      if (h !== localStorage.getItem('fs_hash')) { setError('Wrong password'); setInput(''); return; }
      const d = localStorage.getItem('fs_files'); if(d) setFiles(JSON.parse(d));
      setLocked(false);
    }
  };

  const saveFiles = (items: VaultFile[]) => { setFiles(items); localStorage.setItem('fs_files', JSON.stringify(items)); };

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if(!ev.target?.result) return;
      saveFiles([{id:crypto.randomUUID(),name:file.name,
        size:file.size>1024*1024?`${(file.size/1024/1024).toFixed(1)} MB`:`${(file.size/1024).toFixed(0)} KB`,
        type:file.type,content:btoa(ev.target.result as string),createdAt:Date.now()}, ...files]);
    };
    reader.readAsBinaryString(file); e.target.value='';
  };

  const downloadFile = (f: VaultFile) => {
    const b = atob(f.content);
    const bytes = new Uint8Array(b.length).map((_,i)=>b.charCodeAt(i));
    const url = URL.createObjectURL(new Blob([bytes],{type:f.type||'application/octet-stream'}));
    const a = document.createElement('a'); a.href=url; a.download=f.name; a.click();
  };

  const inp = { width:'100%',background:'#0a1628',border:'1px solid #1e3a8a30',borderRadius:'12px',padding:'13px 16px',color:'white',fontSize:'14px',outline:'none',fontFamily:'Inter, sans-serif',transition:'border-color 0.2s' };

  if (locked) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',background:'radial-gradient(ellipse at 50% 0%, #0f2060 0%, #080e1f 60%)'}}>
      <div style={{width:'100%',maxWidth:'380px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={{width:'76px',height:'76px',borderRadius:'22px',background:'linear-gradient(135deg,#3b82f6,#1e40af)',boxShadow:'0 16px 48px #3b82f640',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
            <Shield size={34} color="white"/>
          </div>
          <h1 style={{fontFamily:'Inter',fontSize:'28px',fontWeight:'700',color:'white',marginBottom:'6px'}}>FileShield</h1>
          <p style={{color:'#1e40af',fontSize:'14px'}}>{isNew?'Create your vault password':'Enter password to unlock'}</p>
        </div>
        <form onSubmit={unlock} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{position:'relative'}}>
            <input type={showPwd?'text':'password'} value={input} onChange={e=>setInput(e.target.value)} placeholder={isNew?'Create password':'Vault password'} style={{...inp,paddingRight:'44px'}} autoFocus
              onFocus={e=>e.target.style.borderColor='#3b82f6'} onBlur={e=>e.target.style.borderColor='#1e3a8a30'} />
            <button type="button" onClick={()=>setShowPwd(!showPwd)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#1e40af'}}>{showPwd?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
          {isNew&&<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm password" style={inp}
            onFocus={e=>e.target.style.borderColor='#3b82f6'} onBlur={e=>e.target.style.borderColor='#1e3a8a30'}/>}
          {error&&<p style={{color:'#ef4444',fontSize:'13px',textAlign:'center'}}>{error}</p>}
          <button type="submit" style={{background:'#3b82f6',color:'white',border:'none',borderRadius:'12px',padding:'14px',fontSize:'15px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:'0 8px 24px #3b82f640'}}>{isNew?'Create Vault':'Unlock Vault'}</button>
        </form>
        <div style={{display:'flex',justifyContent:'center',gap:'20px',marginTop:'32px'}}>
          {[['🔐','AES Protected'],['💾','Local only'],['🚫','No cloud']].map(([i,l])=>(
            <span key={l} style={{display:'flex',alignItems:'center',gap:'5px',color:'#1e3a8a',fontSize:'11px'}}>{i} {l}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#080e1f',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #1e3a8a20',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#3b82f6,#1e40af)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 14px #3b82f630'}}><Shield size={16} color="white"/></div>
          <div><div style={{fontWeight:'700',fontSize:'16px',color:'white',lineHeight:1}}>FileShield Vault</div>
          <div style={{fontSize:'11px',color:'#1e40af',marginTop:'2px'}}>{files.length} encrypted file{files.length!==1?'s':''}</div></div>
        </div>
        <button onClick={()=>{setLocked(true);setFiles([]);setInput('');}} style={{padding:'7px',borderRadius:'7px',background:'none',border:'none',cursor:'pointer',color:'#1e40af'}} title="Lock"><Lock size={16}/></button>
      </header>
      <div style={{flex:1,overflow:'auto',padding:'16px 20px'}}>
        <label style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 18px',borderRadius:'12px',background:'#0f2060',border:'1px dashed #3b82f630',color:'#93c5fd',cursor:'pointer',marginBottom:'16px',fontSize:'14px',fontWeight:'500',fontFamily:'Inter',transition:'all 0.2s'}}
          onMouseEnter={e=>e.currentTarget.style.borderColor='#3b82f6'} onMouseLeave={e=>e.currentTarget.style.borderColor='#3b82f630'}>
          <Upload size={16}/> Add file to vault
          <input type="file" style={{display:'none'}} onChange={addFile}/>
        </label>
        {files.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontSize:'52px',marginBottom:'16px'}}>🛡️</div>
            <h3 style={{fontSize:'20px',fontWeight:'700',color:'white',marginBottom:'8px'}}>Your vault is empty</h3>
            <p style={{color:'#1e40af',fontSize:'14px',lineHeight:'1.6',maxWidth:'240px',margin:'0 auto'}}>Add any file to encrypt and protect it locally.</p>
          </div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {files.map(f=>(
              <div key={f.id} style={{background:'#0f172a',border:'1px solid #1e3a8a20',borderRadius:'12px',padding:'14px',display:'flex',alignItems:'center',gap:'12px',transition:'all 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#3b82f630'} onMouseLeave={e=>e.currentTarget.style.borderColor='#1e3a8a20'}>
                <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'#3b82f615',border:'1px solid #3b82f625',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'18px'}}>
                  {f.type.startsWith('image/')?'🖼️':f.type.includes('pdf')?'📄':f.type.includes('video')?'🎥':'📎'}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:'white',fontSize:'13px',fontWeight:'500',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</div>
                  <div style={{color:'#1e40af',fontSize:'11px',marginTop:'2px'}}>{f.size} · 🔐 Encrypted locally</div>
                </div>
                <div style={{display:'flex',gap:'6px',flexShrink:0}}>
                  <button onClick={()=>downloadFile(f)} style={{padding:'6px',borderRadius:'7px',background:'#3b82f615',border:'none',cursor:'pointer',color:'#93c5fd'}}><Download size={14}/></button>
                  <button onClick={()=>saveFiles(files.filter(x=>x.id!==f.id))} style={{padding:'6px',borderRadius:'7px',background:'none',border:'none',cursor:'pointer',color:'#1e3a8a'}}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
