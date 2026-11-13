export const DEFAULT_COLORS={Gui:{primary:'#66884d',secondary:'#f0f4e9'},Helen:{primary:'#bb8777',secondary:'#fbf1ed'}};
export const validColor=value=>typeof value==='string'&&/^#[0-9a-fA-F]{6}$/.test(value);
const rgb=color=>[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
export function luminance(color){const a=rgb(color).map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});return a[0]*.2126+a[1]*.7152+a[2]*.0722}
export const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const foreground=color=>luminance(color)>.179?'#000000':'#ffffff';
const mix=(a,b,t)=>'#'+rgb(a).map((v,i)=>Math.round(v*(1-t)+rgb(b)[i]*t).toString(16).padStart(2,'0')).join('');
export function theme(value){
 const primary=validColor(value)?value:validColor(value?.primary)?value.primary:DEFAULT_COLORS.Gui.primary;
 const secondary=validColor(value?.secondary)?value.secondary:DEFAULT_COLORS.Gui.secondary;
 const onSecondary=foreground(secondary);const page=mix(secondary,'#ffffff',.88);
 return {'--accent':primary,'--on-accent':foreground(primary),'--secondary':secondary,'--on-secondary':onSecondary,'--secondary-line':mix(secondary,onSecondary,.35),'--page':page,'--accent-ink':contrast(primary,page)>=4.5?primary:'#253d36','--tint':mix(primary,'#ffffff',.91),'--line':mix(primary,'#ffffff',.75),'--ink':'#253d36'};
}
