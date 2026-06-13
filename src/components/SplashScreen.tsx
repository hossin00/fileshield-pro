import { useEffect, useState } from 'react';
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => onDone(), 2400);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(ellipse at 50% 20%, #262c3d 0%, #080e1f 65%)',
      opacity:phase===2?0:1, transition:'opacity 0.5s ease' }}>
      <div style={{ transform:phase>=1?'scale(1) translateY(0)':'scale(0.5) translateY(30px)', opacity:phase>=1?1:0,
        transition:'all 0.7s cubic-bezier(0.34,1.56,0.64,1)', marginBottom:'24px' }}>
        <div style={{ width:'88px', height:'88px', borderRadius:'24px',
          background:'linear-gradient(135deg, #3b82f6, #3b82f6cc)',
          boxShadow:'0 20px 60px #3b82f650', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src="/fileshield-pro/icon-512.png" width="48" height="48" style={{borderRadius:'12px'}} />
        </div>
      </div>
      <div style={{ opacity:phase>=1?1:0, transform:phase>=1?'translateY(0)':'translateY(12px)',
        transition:'all 0.5s ease 0.15s', textAlign:'center', marginBottom:'48px' }}>
        <h1 style={{ fontFamily:'Inter, sans-serif', fontWeight:'700', fontSize:'30px', color:'white', marginBottom:'8px' }}>FileShield Pro</h1>
        <p style={{ color:'#3b82f680', fontSize:'14px' }}>Your files. Encrypted. Private.</p>
      </div>
      <div style={{ opacity:phase>=1?1:0, transition:'opacity 0.3s ease 0.4s',
        display:'flex', flexDirection:'column', gap:'10px', alignItems:'center' }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", background:"#ffffff06", border:"1px solid #ffffff10", borderRadius:"12px", padding:"10px 16px", width:"250px" }}><span style={{fontSize:"20px"}}>🔐</span><div><div style={{color:"white", fontSize:"13px", fontWeight:"500"}}>AES-256 File Encryption</div><div style={{color:"#3b82f680", fontSize:"11px"}}>Military-grade protection</div></div></div>
<div style={{ display:"flex", alignItems:"center", gap:"12px", background:"#ffffff06", border:"1px solid #ffffff10", borderRadius:"12px", padding:"10px 16px", width:"250px" }}><span style={{fontSize:"20px"}}>📁</span><div><div style={{color:"white", fontSize:"13px", fontWeight:"500"}}>Secure File Vault</div><div style={{color:"#3b82f680", fontSize:"11px"}}>Organize protected files</div></div></div>
<div style={{ display:"flex", alignItems:"center", gap:"12px", background:"#ffffff06", border:"1px solid #ffffff10", borderRadius:"12px", padding:"10px 16px", width:"250px" }}><span style={{fontSize:"20px"}}>🔑</span><div><div style={{color:"white", fontSize:"13px", fontWeight:"500"}}>Password Protected</div><div style={{color:"#3b82f680", fontSize:"11px"}}>Only you can access</div></div></div>
      </div>
      <div style={{ position:'absolute', bottom:'60px', display:'flex', gap:'6px', opacity:phase>=1?1:0 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%',
          background:'#3b82f6', animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }}/>)}
      </div>
      <style>{`@keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
