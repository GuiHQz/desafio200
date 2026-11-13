export const TOTAL=20100;
export function validate(player,values){return ['Gui','Helen'].includes(player)&&Array.isArray(values)&&values.length>0&&values.length<=200&&new Set(values).size===values.length&&values.every(n=>Number.isInteger(n)&&n>=1&&n<=200)}
export function summary(rows,player){const own=rows.filter(r=>r.player===player);return {count:own.length,total:own.reduce((s,r)=>s+r.value,0),completedAt:own.length===200?own.reduce((a,r)=>a>r.created_at?a:r.created_at,''):null}}
