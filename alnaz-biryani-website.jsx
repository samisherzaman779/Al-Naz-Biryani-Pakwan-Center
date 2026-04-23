import { useState, useEffect, useRef, useCallback } from "react";

const MENU = [
  { category: "Biryani", icon: "🍚", items: [
    { id:"b1", name:"Beef Biryani – Half",    desc:"Tender beef, hand-ground masala, aged basmati", price:280, tag:"Best Seller" },
    { id:"b2", name:"Beef Biryani – Full",    desc:"Full degh serving for 2-3 people",             price:520, tag:null },
    { id:"b3", name:"Chicken Biryani – Half", desc:"Juicy chicken, saffron rice, dum-cooked",      price:250, tag:"Popular" },
    { id:"b4", name:"Chicken Biryani – Full", desc:"Full serving, feeds a family",                 price:480, tag:null },
    { id:"b5", name:"Nalli Biryani – Half",   desc:"Lamb shank with bone marrow richness",         price:350, tag:"Special" },
    { id:"b6", name:"Nalli Biryani – Full",   desc:"Premium slow-cooked nalli biryani",            price:650, tag:null },
    { id:"b7", name:"Mutton Biryani – Half",  desc:"Classic Karachi mutton dum biryani",           price:320, tag:null },
    { id:"b8", name:"Mutton Biryani – Full",  desc:"Full pot, perfect for gatherings",             price:600, tag:null },
  ]},
  { category: "Pulao", icon: "🥘", items: [
    { id:"p1", name:"Chicken Pulao – Half", desc:"Delicately spiced yakhni chicken rice", price:220, tag:"Popular" },
    { id:"p2", name:"Chicken Pulao – Full", desc:"Full serving with caramelised onions",  price:420, tag:null },
    { id:"p3", name:"Beef Pulao – Half",    desc:"Rich beef yakhni pulao",                price:260, tag:null },
    { id:"p4", name:"Beef Pulao – Full",    desc:"Generous full portion",                 price:490, tag:null },
    { id:"p5", name:"White Pulao – Half",   desc:"Fragrant plain rice, great as a side",  price:180, tag:null },
  ]},
  { category: "Pakwan", icon: "🍽️", items: [
    { id:"k1", name:"Aloo Ka Salan", desc:"Classic potato curry, Karachi-style", price:150, tag:null },
    { id:"k2", name:"Daal Chawal",   desc:"Comforting lentils over steamed rice", price:120, tag:null },
    { id:"k3", name:"Raita",         desc:"Fresh yogurt with cumin and mint",    price:60,  tag:null },
    { id:"k4", name:"Salad",         desc:"Fresh salad with lemon dressing",     price:50,  tag:null },
    { id:"k5", name:"Papad",         desc:"Crispy fried papad, 2 pieces",        price:40,  tag:null },
  ]},
  { category: "Drinks", icon: "🥤", items: [
    { id:"d1", name:"Pepsi / 7-Up / Mirinda", desc:"Chilled bottled cold drink",      price:80, tag:null },
    { id:"d2", name:"Rooh Afza",              desc:"Classic rose sherbet, cold & sweet", price:70, tag:null },
    { id:"d3", name:"Mineral Water",          desc:"Nestle Pure Life 500ml",           price:50, tag:null },
  ]},
];

const DELIVERY_FEE = 80;
const MIN_ORDER    = 300;
const WA_NUMBER    = "923452958883";

function buildWAMessage(cart, form, orderType, total) {
  const lines   = cart.map(i => `  • ${i.name} ×${i.qty} = Rs.${i.price * i.qty}`).join("\n");
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const time     = new Date().toLocaleTimeString("en-PK",{hour:"2-digit",minute:"2-digit"});
  const msg =
    `🍛 *New Order — Al-Naz Biryani*\n\n` +
    `👤 *Name:* ${form.name}\n` +
    `📞 *Phone:* ${form.phone}\n` +
    `📦 *Type:* ${orderType === "delivery" ? "🛵 Delivery" : "🏃 Pickup/Takeaway"}\n` +
    (orderType === "delivery" ? `🏠 *Address:* ${form.address}\n` : "") +
    `🕒 *Time:* ${time}\n\n` +
    `*Items:*\n${lines}\n\n` +
    `Subtotal: Rs.${subtotal}\n` +
    (orderType === "delivery" ? `Delivery: Rs.${DELIVERY_FEE}\n` : "") +
    `*TOTAL: Rs.${total}*\n\n` +
    (form.note ? `📝 *Note:* ${form.note}\n\n` : "") +
    `_Sent from alnazbiryani.pk_`;
  return encodeURIComponent(msg);
}

/* ── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div style={{position:"fixed",bottom:"7rem",left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:"8px",pointerEvents:"none",alignItems:"center"}}>
      {toasts.map(t => (
        <div key={t.id} style={{background:"#d4a017",color:"#0a0704",padding:"10px 22px",fontSize:"0.82rem",fontWeight:"bold",letterSpacing:"0.05em",animation:"toastIn .3s ease",whiteSpace:"nowrap",boxShadow:"0 4px 24px rgba(0,0,0,.5)"}}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── Cart Drawer ────────────────────────────────────────────────────────── */
function CartDrawer({ cart, onClose, onUpdate, onRemove, onCheckout }) {
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const canCheckout = subtotal >= MIN_ORDER;
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:200,backdropFilter:"blur(4px)"}}/>
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(420px,100vw)",background:"#100c07",borderLeft:"1px solid rgba(212,160,23,.2)",zIndex:201,display:"flex",flexDirection:"column",animation:"slideRight .3s ease"}}>

        {/* Header */}
        <div style={{padding:"1.4rem 1.5rem",borderBottom:"1px solid rgba(212,160,23,.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontSize:"0.65rem",letterSpacing:".25em",textTransform:"uppercase",color:"#d4a017",marginBottom:"2px"}}>Your Order</p>
            <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.25rem",color:"#f5ead8"}}>
              {cart.length} {cart.length===1?"item":"items"}
            </p>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(212,160,23,.2)",color:"#a0896a",width:"34px",height:"34px",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        {/* Items */}
        <div style={{flex:1,overflowY:"auto",padding:"1rem 1.5rem"}}>
          {cart.length === 0 ? (
            <div style={{textAlign:"center",padding:"4rem 0",color:"#4a3e30"}}>
              <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🛒</div>
              <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.05rem",color:"#7a6a55"}}>Cart is empty</p>
              <p style={{fontSize:"0.8rem",marginTop:"6px",color:"#4a3e30"}}>Add something delicious!</p>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
              {cart.map(item => (
                <div key={item.id} style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(212,160,23,.08)",padding:"1rem",display:"flex",gap:"0.8rem",alignItems:"center"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:"0.88rem",color:"#f5ead8",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</p>
                    <p style={{fontSize:"0.78rem",color:"#d4a017"}}>Rs.{item.price} each</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}>
                    <button onClick={()=>onUpdate(item.id, item.qty-1)} style={{width:"26px",height:"26px",background:"rgba(212,160,23,.1)",border:"1px solid rgba(212,160,23,.3)",color:"#d4a017",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{color:"#f5ead8",fontSize:"0.9rem",minWidth:"18px",textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>onUpdate(item.id, item.qty+1)} style={{width:"26px",height:"26px",background:"rgba(212,160,23,.1)",border:"1px solid rgba(212,160,23,.3)",color:"#d4a017",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <div style={{minWidth:"58px",textAlign:"right",flexShrink:0}}>
                    <p style={{color:"#f5ead8",fontSize:"0.88rem",fontWeight:"bold"}}>Rs.{item.price*item.qty}</p>
                    <button onClick={()=>onRemove(item.id)} style={{background:"none",border:"none",color:"#5a3030",cursor:"pointer",fontSize:"0.7rem",marginTop:"3px"}}>remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{padding:"1.4rem 1.5rem",borderTop:"1px solid rgba(212,160,23,.1)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
              <span style={{color:"#7a6a55",fontSize:"0.83rem"}}>Subtotal</span>
              <span style={{color:"#f5ead8",fontSize:"0.83rem"}}>Rs.{subtotal}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
              <span style={{color:"#5a4e3a",fontSize:"0.72rem"}}>+ Delivery fee at checkout</span>
            </div>
            {!canCheckout && (
              <p style={{fontSize:"0.73rem",color:"#c47a2a",textAlign:"center",marginBottom:"0.7rem",background:"rgba(196,122,42,.1)",padding:"7px",border:"1px solid rgba(196,122,42,.2)"}}>
                Minimum order Rs.{MIN_ORDER} · Add Rs.{MIN_ORDER-subtotal} more
              </p>
            )}
            <button
              onClick={canCheckout ? onCheckout : undefined}
              style={{width:"100%",background:canCheckout?"#d4a017":"#2a2010",color:canCheckout?"#0a0704":"#5a4e30",border:"none",padding:"13px",fontSize:"0.82rem",letterSpacing:".12em",textTransform:"uppercase",cursor:canCheckout?"pointer":"not-allowed",fontWeight:"bold",transition:"background .2s"}}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Checkout Modal ─────────────────────────────────────────────────────── */
function CheckoutModal({ cart, onClose, onPlaced }) {
  const [step,      setStep]      = useState(1);
  const [orderType, setOrderType] = useState("delivery");
  const [form,      setForm]      = useState({name:"",phone:"",address:"",note:""});
  const [errors,    setErrors]    = useState({});
  const [placing,   setPlacing]   = useState(false);

  const subtotal    = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total       = subtotal + deliveryFee;

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "Name required";
    if (!/^[\d\s\+\-]{10,14}$/.test(form.phone.trim())) e.phone = "Valid phone number required";
    if (orderType === "delivery" && !form.address.trim()) e.address = "Delivery address required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const msg = buildWAMessage(cart, form, orderType, total);
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
      setStep(3);
      setPlacing(false);
      onPlaced();
    }, 900);
  };

  const inp = (err) => ({
    width:"100%", background:"rgba(255,255,255,.03)", border:`1px solid ${err?"#c47a2a":"rgba(212,160,23,.2)"}`,
    color:"#f5ead8", padding:"11px 13px", fontSize:"0.88rem", outline:"none", fontFamily:"Georgia,serif", transition:"border-color .2s",
  });
  const lbl = { fontSize:"0.65rem", letterSpacing:".22em", textTransform:"uppercase", color:"#d4a017", marginBottom:"5px", display:"block" };

  return (
    <>
      <div onClick={step===3 ? onClose : undefined} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:300,backdropFilter:"blur(6px)"}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(540px,96vw)",maxHeight:"92vh",overflowY:"auto",background:"#100c07",border:"1px solid rgba(212,160,23,.2)",zIndex:301,animation:"scaleIn .25s ease"}}>

        {step < 3 && (
          <div style={{display:"flex",borderBottom:"1px solid rgba(212,160,23,.08)"}}>
            {["Details","Review","Done"].map((s,i) => (
              <div key={s} style={{flex:1,padding:"0.9rem",textAlign:"center",borderBottom:step===i+1?"2px solid #d4a017":"2px solid transparent",background:step===i+1?"rgba(212,160,23,.05)":"transparent"}}>
                <span style={{fontSize:"0.65rem",letterSpacing:".18em",textTransform:"uppercase",color:step>=i+1?"#d4a017":"#4a3e30"}}>
                  {step>i+1?"✓ ":""}{s}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{padding:"1.8rem"}}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.35rem",color:"#f5ead8",marginBottom:"1.6rem"}}>Your Details</p>

              <div style={{marginBottom:"1.6rem"}}>
                <label style={lbl}>Order Type</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"}}>
                  {[["delivery","🛵","Delivery",`+Rs.${DELIVERY_FEE}`],["pickup","🏃","Pickup","Free"]].map(([val,icon,label,sub]) => (
                    <div key={val} onClick={()=>setOrderType(val)} style={{padding:"0.9rem",border:`1px solid ${orderType===val?"#d4a017":"rgba(212,160,23,.15)"}`,background:orderType===val?"rgba(212,160,23,.07)":"transparent",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                      <div style={{fontSize:"1.5rem",marginBottom:"3px"}}>{icon}</div>
                      <div style={{fontSize:"0.88rem",color:orderType===val?"#d4a017":"#f5ead8",fontWeight:"bold"}}>{label}</div>
                      <div style={{fontSize:"0.7rem",color:"#7a6a55",marginTop:"2px"}}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:"1.1rem"}}>
                <label style={lbl}>Full Name *</label>
                <input style={inp(errors.name)} placeholder="Aapka naam" value={form.name}
                  onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor="#d4a017"}
                  onBlur={e=>e.target.style.borderColor=errors.name?"#c47a2a":"rgba(212,160,23,.2)"}/>
                {errors.name && <p style={{color:"#c47a2a",fontSize:"0.72rem",marginTop:"4px"}}>{errors.name}</p>}
              </div>

              <div style={{marginBottom:"1.1rem"}}>
                <label style={lbl}>Phone / WhatsApp *</label>
                <input style={inp(errors.phone)} placeholder="03XX-XXXXXXX" value={form.phone}
                  onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor="#d4a017"}
                  onBlur={e=>e.target.style.borderColor=errors.phone?"#c47a2a":"rgba(212,160,23,.2)"}/>
                {errors.phone && <p style={{color:"#c47a2a",fontSize:"0.72rem",marginTop:"4px"}}>{errors.phone}</p>}
              </div>

              {orderType === "delivery" && (
                <div style={{marginBottom:"1.1rem"}}>
                  <label style={lbl}>Delivery Address *</label>
                  <textarea style={{...inp(errors.address),resize:"none",height:"76px"}} placeholder="Ghar ka pura address..."
                    value={form.address}
                    onChange={e=>setForm(f=>({...f,address:e.target.value}))}
                    onFocus={e=>e.target.style.borderColor="#d4a017"}
                    onBlur={e=>e.target.style.borderColor=errors.address?"#c47a2a":"rgba(212,160,23,.2)"}/>
                  {errors.address && <p style={{color:"#c47a2a",fontSize:"0.72rem",marginTop:"4px"}}>{errors.address}</p>}
                </div>
              )}

              <div style={{marginBottom:"1.6rem"}}>
                <label style={lbl}>Special Instructions (optional)</label>
                <textarea style={{...inp(false),resize:"none",height:"64px"}} placeholder="Extra spicy, less oil, etc."
                  value={form.note}
                  onChange={e=>setForm(f=>({...f,note:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor="#d4a017"}
                  onBlur={e=>e.target.style.borderColor="rgba(212,160,23,.2)"}/>
              </div>

              <div style={{display:"flex",gap:"0.7rem"}}>
                <button onClick={onClose} style={{flex:1,background:"transparent",border:"1px solid rgba(212,160,23,.2)",color:"#7a6a55",padding:"12px",cursor:"pointer",fontSize:"0.8rem",letterSpacing:".1em",textTransform:"uppercase"}}>← Back</button>
                <button onClick={()=>{ if(validate()) setStep(2); }} style={{flex:2,background:"#d4a017",border:"none",color:"#0a0704",padding:"12px",cursor:"pointer",fontSize:"0.8rem",letterSpacing:".12em",textTransform:"uppercase",fontWeight:"bold"}}>Review Order →</button>
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.35rem",color:"#f5ead8",marginBottom:"1.5rem"}}>Review Your Order</p>

              <div style={{background:"rgba(212,160,23,.04)",border:"1px solid rgba(212,160,23,.1)",padding:"1rem",marginBottom:"1.3rem"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.7rem"}}>
                  {[["👤 Name",form.name],["📞 Phone",form.phone],["📦 Type",orderType==="delivery"?"🛵 Delivery":"🏃 Pickup"],...(orderType==="delivery"?[["📍 Address",form.address]]:[])].map(([l,v])=>(
                    <div key={l} style={{gridColumn:l.includes("Address")?"1/-1":"auto"}}>
                      <p style={{fontSize:"0.65rem",color:"#7a6a55",letterSpacing:".12em",marginBottom:"2px"}}>{l}</p>
                      <p style={{fontSize:"0.87rem",color:"#f5ead8"}}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:"1.3rem"}}>
                <p style={{fontSize:"0.65rem",letterSpacing:".2em",textTransform:"uppercase",color:"#d4a017",marginBottom:"0.7rem"}}>Order Items</p>
                {cart.map(item=>(
                  <div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"0.6rem 0",borderBottom:"1px solid rgba(212,160,23,.06)"}}>
                    <span style={{fontSize:"0.86rem",color:"#f5ead8"}}>{item.name} <span style={{color:"#7a6a55"}}>×{item.qty}</span></span>
                    <span style={{fontSize:"0.86rem",color:"#d4a017",fontWeight:"bold"}}>Rs.{item.price*item.qty}</span>
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(212,160,23,.04)",border:"1px solid rgba(212,160,23,.1)",padding:"1rem",marginBottom:"1.3rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                  <span style={{color:"#7a6a55",fontSize:"0.84rem"}}>Subtotal</span>
                  <span style={{color:"#f5ead8",fontSize:"0.84rem"}}>Rs.{subtotal}</span>
                </div>
                {orderType==="delivery" && (
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                    <span style={{color:"#7a6a55",fontSize:"0.84rem"}}>Delivery Fee</span>
                    <span style={{color:"#f5ead8",fontSize:"0.84rem"}}>Rs.{DELIVERY_FEE}</span>
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:"0.6rem",borderTop:"1px solid rgba(212,160,23,.15)",marginTop:"5px"}}>
                  <span style={{color:"#d4a017",fontSize:"0.98rem",fontWeight:"bold"}}>Total</span>
                  <span style={{color:"#d4a017",fontSize:"0.98rem",fontWeight:"bold"}}>Rs.{total}</span>
                </div>
              </div>

              <div style={{background:"rgba(37,145,50,.07)",border:"1px solid rgba(37,145,50,.2)",padding:"0.8rem",marginBottom:"1.4rem",display:"flex",gap:"0.8rem",alignItems:"flex-start"}}>
                <span style={{fontSize:"1.1rem"}}>💬</span>
                <p style={{fontSize:"0.78rem",color:"#80b878",lineHeight:1.65}}>
                  Order WhatsApp per send hoga. "Place via WhatsApp" dabane ke baad aapka message Al-Naz ke WhatsApp per directly jayega.
                </p>
              </div>

              <div style={{display:"flex",gap:"0.7rem"}}>
                <button onClick={()=>setStep(1)} style={{flex:1,background:"transparent",border:"1px solid rgba(212,160,23,.2)",color:"#7a6a55",padding:"12px",cursor:"pointer",fontSize:"0.8rem",letterSpacing:".1em",textTransform:"uppercase"}}>← Edit</button>
                <button onClick={handlePlaceOrder} disabled={placing} style={{flex:2,background:placing?"#1a6e2a":"#25a244",border:"none",color:"#fff",padding:"12px",cursor:placing?"not-allowed":"pointer",fontSize:"0.8rem",letterSpacing:".1em",textTransform:"uppercase",fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",transition:"background .2s"}}>
                  {placing ? "⏳ Sending…" : "💬 Place via WhatsApp"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={{textAlign:"center",padding:"0.5rem 0"}}>
              <div style={{fontSize:"4rem",marginBottom:"1.2rem",animation:"bounceIn .5s ease"}}>✅</div>
              <p style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.55rem",color:"#d4a017",marginBottom:"0.6rem"}}>Order Sent!</p>
              <p style={{color:"#7a6a55",fontSize:"0.88rem",lineHeight:1.8,marginBottom:"0.4rem"}}>
                Aapka order WhatsApp per Al-Naz ko bhej diya gaya.
              </p>
              <p style={{color:"#a0896a",fontSize:"0.86rem",lineHeight:1.8,marginBottom:"1.8rem"}}>
                📞 <strong style={{color:"#f5ead8"}}>+92 345-2958883</strong> per confirm zaroor karen.<br/>
                Estimated delivery: <strong style={{color:"#f5ead8"}}>30 – 45 mins</strong>
              </p>
              <div style={{background:"rgba(212,160,23,.05)",border:"1px solid rgba(212,160,23,.1)",padding:"1.2rem",marginBottom:"1.8rem"}}>
                <p style={{fontSize:"0.72rem",color:"#7a6a55",marginBottom:"4px"}}>Order Total</p>
                <p style={{fontSize:"1.7rem",color:"#d4a017",fontFamily:"Georgia,serif",fontStyle:"italic"}}>Rs.{total}</p>
                <p style={{fontSize:"0.7rem",color:"#4a3e30",marginTop:"4px"}}>
                  {orderType==="delivery" ? `Delivery to: ${form.address}` : "Pickup / Takeaway"}
                </p>
              </div>
              <button onClick={onClose} style={{background:"#d4a017",border:"none",color:"#0a0704",padding:"13px 36px",fontSize:"0.8rem",letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer",fontWeight:"bold"}}>
                Done 🎉
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── MAIN ───────────────────────────────────────────────────────────────── */
export default function AlNazWebsite() {
  const [activeNav,      setActiveNav]      = useState("Home");
  const [scrolled,       setScrolled]       = useState(false);
  const [activeCategory, setActiveCategory] = useState("Biryani");
  const [cart,           setCart]           = useState([]);
  const [cartOpen,       setCartOpen]       = useState(false);
  const [checkoutOpen,   setCheckoutOpen]   = useState(false);
  const [toasts,         setToasts]         = useState([]);

  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>60); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);

  const addToast = useCallback((msg) => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 2200);
  }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const ex = prev.find(x=>x.id===item.id);
      return ex ? prev.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x) : [...prev,{...item,qty:1}];
    });
    addToast(`🍛 ${item.name.split("–")[0].trim()} added!`);
  },[addToast]);

  const updateQty = useCallback((id,qty) => {
    if(qty<=0) setCart(p=>p.filter(x=>x.id!==id));
    else       setCart(p=>p.map(x=>x.id===id?{...x,qty}:x));
  },[]);

  const removeItem = useCallback((id)=>setCart(p=>p.filter(x=>x.id!==id)),[]);

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const currentItems = MENU.find(m=>m.category===activeCategory)?.items || [];

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:"smooth"});
    setActiveNav(id);
  };

  /* styles */
  const gold  = "#d4a017";
  const dark  = "#0a0704";
  const text  = "#f5ead8";
  const muted = "#7a6a55";
  const dim   = "#4a3e30";

  return (
    <div style={{fontFamily:"Georgia,'Times New Roman',serif",background:dark,color:text,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes scaleIn{from{opacity:0;transform:translate(-50%,-50%) scale(.93)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes bounceIn{0%{transform:scale(.4)}70%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fabPop{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:rgba(212,160,23,.3)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0704}::-webkit-scrollbar-thumb{background:#d4a017;border-radius:2px}
        .a1{animation:fadeUp .8s ease both}
        .a2{animation:fadeUp .9s ease .1s both}
        .a3{animation:fadeUp 1s ease .2s both}
        .a4{animation:fadeUp 1.1s ease .3s both}
        .av{animation:fadeIn 1.2s ease .4s both}
        .nav-lnk:hover{color:${gold}!important}
        .bg:hover{background:#e8b820!important;transform:translateY(-1px)!important}
        .bo:hover{background:rgba(212,160,23,.1)!important}
        .mc:hover{border-color:rgba(212,160,23,.35)!important;background:rgba(212,160,23,.04)!important}
        .qbtn:hover{background:rgba(212,160,23,.2)!important}
        .fab:hover{transform:scale(1.09)!important}
        input,textarea{transition:border-color .2s}
        input:focus,textarea:focus{outline:none;border-color:${gold}!important}
        @media(max-width:760px){
          .hi{grid-template-columns:1fr!important;gap:1.5rem!important}
          .hv{display:none!important}
          .ndl{display:none!important}
          .sg{grid-template-columns:repeat(2,1fr)!important}
          .ag{grid-template-columns:1fr!important;gap:2rem!important}
          .cg{grid-template-columns:1fr!important;gap:2rem!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 1.8rem",height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(10,7,4,.97)":"transparent",borderBottom:scrolled?"1px solid rgba(212,160,23,.15)":"none",transition:"all .4s",backdropFilter:scrolled?"blur(12px)":"none"}}>
        <div onClick={()=>scrollTo("Home")} style={{cursor:"pointer",lineHeight:1}}>
          <span style={{fontStyle:"italic",fontSize:"1.42rem",color:gold,letterSpacing:".04em",display:"block"}}>Al-Naz</span>
          <span style={{fontSize:"0.56rem",letterSpacing:".22em",color:"#a0896a",textTransform:"uppercase",marginTop:"1px",display:"block"}}>Biryani & Pakwan Center</span>
        </div>
        <ul style={{display:"flex",gap:"2rem",listStyle:"none",margin:0,padding:0}} className="ndl">
          {["Home","Menu","About","Contact"].map(link=>(
            <li key={link} className="nav-lnk" onClick={()=>scrollTo(link)} style={{cursor:"pointer",fontSize:"0.76rem",letterSpacing:".14em",textTransform:"uppercase",color:activeNav===link?gold:"#c8b89a",borderBottom:activeNav===link?`1px solid ${gold}`:"1px solid transparent",paddingBottom:"2px",transition:"color .2s"}}>{link}</li>
          ))}
        </ul>
        <button onClick={()=>setCartOpen(true)} style={{background:"transparent",border:`1px solid ${cartCount>0?gold:"rgba(212,160,23,.3)"}`,color:gold,padding:"8px 16px",cursor:"pointer",fontSize:"0.78rem",letterSpacing:".08em",display:"flex",alignItems:"center",gap:"7px",transition:"all .2s",animation:cartCount>0?"fabPop .4s ease":"none"}} className="bo">
          🛒
          {cartCount>0
            ? <><span style={{background:gold,color:dark,borderRadius:"50%",width:"19px",height:"19px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:"bold"}}>{cartCount}</span><span>Rs.{cartTotal}</span></>
            : <span>Cart</span>
          }
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",background:`linear-gradient(135deg,${dark} 0%,#1a0f05 40%,#0f0a04 100%)`,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(ellipse 70% 55% at 70% 50%,rgba(212,160,23,.09) 0%,transparent 60%),radial-gradient(ellipse 38% 38% at 15% 80%,rgba(180,60,20,.06) 0%,transparent 50%)`,zIndex:1}}/>
        <div style={{position:"relative",zIndex:2,maxWidth:"1200px",margin:"0 auto",padding:"0 1.8rem",paddingTop:"68px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"center",width:"100%"}} className="hi">
          <div>
            <span className="a1" style={{display:"inline-block",fontSize:"0.68rem",letterSpacing:".28em",textTransform:"uppercase",color:gold,borderTop:`1px solid ${gold}`,borderBottom:`1px solid ${gold}`,padding:"5px 14px",marginBottom:"1.5rem"}}>
              Est. Karachi, Pakistan
            </span>
            <h1 className="a2" style={{fontStyle:"italic",fontSize:"clamp(2.7rem,5vw,4.7rem)",lineHeight:1.1,color:text,marginBottom:0}}>
              Karachi Ka
              <span style={{color:gold,display:"block"}}> Asli Swaad</span>
            </h1>
            <p className="a3" style={{marginTop:"1.3rem",lineHeight:1.85,color:"#a0896a",fontSize:"0.98rem",maxWidth:"430px"}}>
              Decades of tradition in every grain of rice. Hand-ground masala, slow dum cooking, honest prices — the biryani Karachi loves.
            </p>
            <div className="a4" style={{marginTop:"2rem",display:"flex",gap:"0.8rem",flexWrap:"wrap"}}>
              <button className="bg" onClick={()=>scrollTo("Menu")} style={{background:gold,color:dark,border:"none",padding:"12px 26px",fontSize:"0.78rem",letterSpacing:".14em",textTransform:"uppercase",cursor:"pointer",fontWeight:"bold",transition:"all .2s"}}>
                Order Now 🍛
              </button>
              <button className="bo" onClick={()=>scrollTo("Contact")} style={{background:"transparent",color:gold,border:`1px solid ${gold}`,padding:"12px 26px",fontSize:"0.78rem",letterSpacing:".14em",textTransform:"uppercase",cursor:"pointer",transition:"all .2s"}}>
                Find Us 📍
              </button>
            </div>
          </div>
          <div className="av hv" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div style={{width:"340px",height:"340px",borderRadius:"50%",background:"radial-gradient(circle at 40% 40%,rgba(212,160,23,.12),rgba(180,60,20,.06) 60%,transparent 80%)",border:"1px solid rgba(212,160,23,.18)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",position:"relative"}}>
              <div style={{position:"absolute",width:"380px",height:"380px",borderRadius:"50%",border:"1px dashed rgba(212,160,23,.12)",animation:"spin 30s linear infinite"}}/>
              <span style={{fontSize:"6.5rem",filter:"drop-shadow(0 0 28px rgba(212,160,23,.3))"}}>🍛</span>
              <span style={{marginTop:"0.7rem",fontStyle:"italic",color:gold,fontSize:"0.95rem"}}>Karachi's Finest</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{background:"rgba(212,160,23,.05)",borderTop:"1px solid rgba(212,160,23,.1)",borderBottom:"1px solid rgba(212,160,23,.1)",padding:"1.8rem"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem",textAlign:"center"}} className="sg">
          {[["20+","Years of Taste"],["500+","Daily Plates"],["4","Biryani Types"],["⭐ 4.5","Customer Rating"]].map(([n,l])=>(
            <div key={l}>
              <span style={{fontSize:"1.9rem",color:gold,fontStyle:"italic",display:"block"}}>{n}</span>
              <span style={{fontSize:"0.65rem",letterSpacing:".18em",textTransform:"uppercase",color:muted,marginTop:"4px",display:"block"}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MENU ── */}
      <div id="menu">
        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"4.5rem 1.8rem"}}>
          <p style={{fontSize:"0.65rem",letterSpacing:".3em",textTransform:"uppercase",color:gold,marginBottom:"0.6rem"}}>What We Serve</p>
          <h2 style={{fontStyle:"italic",fontSize:"clamp(1.9rem,3.5vw,2.9rem)",color:text,lineHeight:1.15,marginBottom:"0.7rem"}}>Our Signature Menu</h2>
          <div style={{width:"52px",height:"2px",background:gold,margin:"1.1rem 0"}}/>
          <p style={{color:muted,fontSize:"0.9rem",lineHeight:1.8,maxWidth:"500px",marginBottom:"2.2rem"}}>
            Fresh daily, cooked the traditional way. Tap <strong style={{color:gold}}>+ Add</strong> to build your cart, then checkout via WhatsApp.
          </p>
          {/* Tabs */}
          <div style={{display:"flex",gap:"0.45rem",marginBottom:"2.2rem",flexWrap:"wrap"}}>
            {MENU.map(cat=>(
              <button key={cat.category} onClick={()=>setActiveCategory(cat.category)} style={{padding:"8px 20px",fontSize:"0.75rem",letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",background:activeCategory===cat.category?gold:"transparent",color:activeCategory===cat.category?dark:"#a0896a",border:`1px solid ${activeCategory===cat.category?gold:"rgba(212,160,23,.25)"}`,transition:"all .2s",fontWeight:activeCategory===cat.category?"bold":"normal"}}>
                {cat.icon} {cat.category}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1.1rem"}}>
            {currentItems.map(item=>{
              const inCart = cart.find(c=>c.id===item.id);
              return (
                <div key={item.id} className="mc" style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(212,160,23,.08)",padding:"1.4rem",position:"relative",display:"flex",flexDirection:"column",gap:"0.5rem",transition:"all .2s"}}>
                  {item.tag && <span style={{position:"absolute",top:"0.9rem",right:"0.9rem",fontSize:"0.58rem",letterSpacing:".1em",textTransform:"uppercase",background:gold,color:dark,padding:"2px 8px"}}>{item.tag}</span>}
                  <h3 style={{fontStyle:"italic",fontSize:"1.1rem",color:text,paddingRight:item.tag?"60px":"0"}}>{item.name}</h3>
                  <p style={{fontSize:"0.82rem",color:muted,lineHeight:1.65,flex:1}}>{item.desc}</p>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.3rem"}}>
                    <span style={{fontSize:"1rem",color:gold,fontWeight:"bold"}}>Rs.{item.price}</span>
                    {inCart ? (
                      <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                        <button className="qbtn" onClick={()=>updateQty(item.id,inCart.qty-1)} style={{width:"26px",height:"26px",background:"rgba(212,160,23,.1)",border:"1px solid rgba(212,160,23,.3)",color:gold,cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s"}}>−</button>
                        <span style={{color:text,fontSize:"0.88rem",minWidth:"17px",textAlign:"center"}}>{inCart.qty}</span>
                        <button className="qbtn" onClick={()=>updateQty(item.id,inCart.qty+1)} style={{width:"26px",height:"26px",background:"rgba(212,160,23,.1)",border:"1px solid rgba(212,160,23,.3)",color:gold,cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s"}}>+</button>
                      </div>
                    ) : (
                      <button className="bg" onClick={()=>addToCart(item)} style={{background:gold,border:"none",color:dark,padding:"7px 15px",fontSize:"0.7rem",letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer",fontWeight:"bold",transition:"all .2s"}}>
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div id="about" style={{borderTop:"1px solid rgba(212,160,23,.06)",background:"rgba(255,255,255,.01)"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"4.5rem 1.8rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}} className="ag">
            <div>
              <p style={{fontSize:"0.65rem",letterSpacing:".3em",textTransform:"uppercase",color:gold,marginBottom:"0.6rem"}}>Our Story</p>
              <h2 style={{fontStyle:"italic",fontSize:"clamp(1.9rem,3.5vw,2.9rem)",color:text,lineHeight:1.15,marginBottom:"0.7rem"}}>Taste Born in the Streets of Karachi</h2>
              <div style={{width:"52px",height:"2px",background:gold,margin:"1.1rem 0"}}/>
              <p style={{color:muted,lineHeight:1.9,fontSize:"0.91rem"}}>Al-Naz started with a single degh and a family recipe passed down through generations. Located in Mehmoodabad, we have been feeding Karachi with honest, spicy, aromatic biryani at prices everyone can afford.</p>
              <p style={{color:muted,lineHeight:1.9,fontSize:"0.91rem",marginTop:"0.9rem"}}>Slow-dum method, hand-mixed masala, fresh ingredients daily. No shortcuts — just pure Karachi taste.</p>
            </div>
            <div style={{background:"rgba(212,160,23,.04)",border:"1px solid rgba(212,160,23,.1)",padding:"2.2rem",textAlign:"center",position:"relative"}}>
              <div style={{position:"absolute",top:0,left:"2rem",right:"2rem",height:"2px",background:`linear-gradient(90deg,transparent,${gold},transparent)`}}/>
              <span style={{fontSize:"3.8rem",display:"block",marginBottom:"1.1rem"}}>🫕</span>
              <p style={{fontStyle:"italic",fontSize:"1.35rem",color:gold,lineHeight:1.45}}>"Biryani isn't just food.<br/>It's an emotion."</p>
              <p style={{fontSize:"0.68rem",color:dim,letterSpacing:".18em",textTransform:"uppercase",marginTop:"0.9rem"}}>— Al-Naz Family</p>
              <div style={{display:"flex",justifyContent:"center",gap:"1.8rem",marginTop:"1.8rem"}}>
                {[["🕒","3PM–10PM"],["🛵","Delivery"],["💳","Card OK"]].map(([icon,label])=>(
                  <div key={label} style={{textAlign:"center"}}>
                    <div style={{fontSize:"1.3rem"}}>{icon}</div>
                    <div style={{fontSize:"0.72rem",color:"#a0896a",marginTop:"3px"}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <div id="contact">
        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"4.5rem 1.8rem"}}>
          <p style={{fontSize:"0.65rem",letterSpacing:".3em",textTransform:"uppercase",color:gold,marginBottom:"0.6rem"}}>Visit Us</p>
          <h2 style={{fontStyle:"italic",fontSize:"clamp(1.9rem,3.5vw,2.9rem)",color:text,lineHeight:1.15,marginBottom:"0.7rem"}}>Find Al-Naz</h2>
          <div style={{width:"52px",height:"2px",background:gold,margin:"1.1rem 0 2.5rem"}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem"}} className="cg">
            <div style={{display:"flex",flexDirection:"column",gap:"1.6rem"}}>
              {[["📍","Address","Mehmoodabad, Karachi\nSindh, Pakistan"],["📞","Phone / WhatsApp","+92 345-2958883\n0321-8760608"],["📧","Email","Mehmoodkhalid615@gmail.com"],["🕒","Hours","Monday – Sunday · 3:00 PM – 10:00 PM"],["🛵","Delivery","Available · Foodpanda & Direct Order"]].map(([icon,label,val])=>(
                <div key={label} style={{display:"flex",gap:"1rem"}}>
                  <span style={{fontSize:"1.25rem",marginTop:"2px"}}>{icon}</span>
                  <div>
                    <p style={{fontSize:"0.63rem",letterSpacing:".2em",textTransform:"uppercase",color:gold,marginBottom:"3px"}}>{label}</p>
                    {val.split("\n").map(v=><p key={v} style={{fontSize:"0.88rem",color:text,lineHeight:1.6}}>{v}</p>)}
                  </div>
                </div>
              ))}
              <div style={{display:"flex",gap:"0.7rem",marginTop:"0.4rem"}}>
                <button className="bg" onClick={()=>window.open("tel:+923452958883")} style={{background:gold,color:dark,border:"none",padding:"11px 22px",fontSize:"0.76rem",letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer",fontWeight:"bold",transition:"all .2s"}}>📞 Call</button>
                <button className="bo" onClick={()=>window.open(`https://wa.me/${WA_NUMBER}`)} style={{background:"transparent",color:gold,border:`1px solid ${gold}`,padding:"11px 22px",fontSize:"0.76rem",letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer",transition:"all .2s"}}>💬 WhatsApp</button>
              </div>
            </div>
            <div>
              <div style={{background:"rgba(212,160,23,.04)",border:"1px solid rgba(212,160,23,.12)",height:"270px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.9rem"}}>
                <span style={{fontSize:"2.3rem"}}>🗺️</span>
                <p style={{textAlign:"center",color:"#a0896a",fontSize:"0.86rem",lineHeight:1.7,padding:"0 1.5rem"}}>
                  <strong style={{color:gold}}>Al-Naz Biryani & Pakwan Center</strong><br/>
                  Mehmoodabad, Karachi<br/>24.8525° N, 67.0655° E
                </p>
                <button className="bo" onClick={()=>window.open("https://maps.google.com/?q=Al-Naz+Biryani+Pakwan+Center+Mehmoodabad+Karachi")} style={{background:"transparent",border:`1px solid ${gold}`,color:gold,padding:"9px 20px",fontSize:"0.74rem",letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer",transition:"all .2s"}}>
                  Open in Google Maps →
                </button>
              </div>
              <div style={{marginTop:"1.1rem",background:"rgba(212,160,23,.04)",border:"1px solid rgba(212,160,23,.1)",padding:"1.2rem"}}>
                <p style={{fontSize:"0.63rem",letterSpacing:".18em",color:gold,textTransform:"uppercase",marginBottom:"0.5rem"}}>Bulk / Catering Orders</p>
                <p style={{fontSize:"0.84rem",color:muted,lineHeight:1.7}}>Office lunch, dawat, events? Call or WhatsApp at least 2 hours in advance. Special bulk pricing available.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:"1px solid rgba(212,160,23,.08)",padding:"2rem 1.8rem",textAlign:"center"}}>
        <p style={{fontStyle:"italic",fontSize:"1.05rem",color:gold,marginBottom:"0.3rem"}}>Al-Naz Biryani & Pakwan Center</p>
        <p style={{fontSize:"0.75rem",color:dim,letterSpacing:".07em"}}>Mehmoodabad, Karachi · +92 345-2958883 · 3PM–10PM Daily</p>
        <p style={{fontSize:"0.68rem",color:"#3a3020",marginTop:"0.7rem"}}>© {new Date().getFullYear()} Al-Naz Biryani. Made with ❤️ for Karachi.</p>
      </footer>

      {/* ── FLOATING CART FAB ── */}
      {cartCount > 0 && (
        <button className="fab" onClick={()=>setCartOpen(true)} style={{position:"fixed",bottom:"1.6rem",right:"1.6rem",zIndex:150,background:gold,border:"none",width:"58px",height:"58px",borderRadius:"50%",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 28px rgba(212,160,23,.45)",transition:"transform .2s",fontSize:"1.25rem"}}>
          🛒
          <span style={{position:"absolute",top:"-3px",right:"-3px",background:"#c0321a",color:"#fff",borderRadius:"50%",width:"20px",height:"20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.67rem",fontWeight:"bold",border:"2px solid #0a0704"}}>{cartCount}</span>
        </button>
      )}

      {/* ── TOAST ── */}
      <Toast toasts={toasts}/>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={()=>setCartOpen(false)}
          onUpdate={updateQty}
          onRemove={removeItem}
          onCheckout={()=>{ setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}

      {/* ── CHECKOUT MODAL ── */}
      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={()=>setCheckoutOpen(false)}
          onPlaced={()=>setCart([])}
        />
      )}
    </div>
  );
}
