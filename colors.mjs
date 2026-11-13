export const DEFAULT_COLORS={Gui:'#66884d',Helen:'#bb8777'};
export const validColor=value=>typeof value==='string'&&/^#[0-9a-fA-F]{6}$/.test(value);
export function theme(value){
 const color=validColor(value)?value:DEFAULT_COLORS.Gui;
 const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
 const linear=rgb.map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});
 const luminance=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
 const mix=ratio=>'#'+rgb.map(n=>Math.round(n*(1-ratio)+255*ratio).toString(16).padStart(2,'0')).join('');
 return {'--accent':color,'--on-accent':luminance>.179?'#000000':'#ffffff','--tint':mix(.91),'--line':mix(.75),'--ink':'#253d36'};
}
