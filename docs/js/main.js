const e={nidoran:{startingLevel:1,hp:46,attack:57,defense:40,speed:50,special:40},nidoking:{startingLevel:17,hp:81,attack:92,defense:77,speed:85,special:75}},t={startingLevel:6,lastUsefulLevel:23},a=[{hp:0,attack:0,defense:0,speed:0,special:0},{hp:45,attack:30,defense:35,speed:45,special:20},{hp:90,attack:60,defense:70,speed:90,special:40},{hp:135,attack:90,defense:105,speed:135,special:60},{hp:230,attack:140,defense:195,speed:210,special:105},{hp:240,attack:195,defense:220,speed:305,special:150},{hp:290,attack:270,defense:305,speed:345,special:180},{hp:365,attack:395,defense:565,speed:435,special:240},{hp:450,attack:460,defense:630,speed:530,special:280},{hp:560,attack:606,defense:744,speed:702,special:365},{hp:731,attack:769,defense:909,speed:899,special:475},{hp:891,attack:959,defense:1109,speed:1044,special:600},{hp:1006,attack:1129,defense:1283,speed:1224,special:740},{hp:1136,attack:1329,defense:1493,speed:1369,special:861},{hp:1306,attack:1505,defense:1643,speed:1591,special:991},{hp:1506,attack:1758,defense:1849,speed:1870,special:1171},{hp:1506,attack:1758,defense:1849,speed:1870,special:1171},{hp:1506,attack:1758,defense:1849,speed:1870,special:1171}],s=["special","speed","defense","attack"];function l(){return[...Array(16)].map((e,t)=>t)}function n(){return{hp:l(),attack:l(),defense:l(),speed:l(),special:l()}}function p(e,t){return(e>>t)%2!=0}function c(e,t){return!e.map(e=>p(e,t)).some(e=>!0===e)}function i(e,t){return!e.map(e=>p(e,t)).some(e=>!1===e)}function d(e,t){return e.filter(e=>!p(e,t))}function r(e,t){return e.filter(e=>p(e,t))}function f(){for(var l=0;l<=3;l++)c(o.hp,l)?o[s[l]]=d(o[s[l]],0):i(o.hp,l)&&(o[s[l]]=r(o[s[l]],0)),c(o[s[l]],0)?o.hp=d(o.hp,l):i(o[s[l]],0)&&(o.hp=r(o.hp,l));let n=parseInt($("#level").val()),p="";for(starter in e)e[starter].startingLevel<n&&(p=starter);for(let s in o){let l=o[s],c=l.map(l=>Math.floor(Math.floor(2*(e[p][s]+l)+Math.floor(Math.ceil(Math.sqrt(a[n-t.startingLevel][s]))/4))*n/100)+5);"hp"===s&&(c=c.map(e=>e+n+5));let i=$(`[data-statType="${s}"]`);i.find(".form-row").remove();let d=$(`[data-dvType="${s}"]`).find(".dvRange").empty(),r=l[0],f=l[l.length-1];d.append(r===f?r:`${r}-${f}`),[...new Set(c)].forEach(e=>{let t=l.filter((t,a)=>c[a]!=e);i.append(`<div class="form-row form-group"><label class="sr-only" for="${e}${s}">${e} ${s}</label><button class="form-control btn btn-primary" type="button" id="${e}${s}" data-removedvs="[${t}]" data-dvtype="${s}">${e}</button></div>`)})}}$(".dvButtons").on("click","button",(function(){let e=$(this),t=e.data("dvtype");o[t]=o[t].filter(t=>!e.data("removedvs").includes(t)),f()})),$("#level").on("change",(function(){this.value<t.startingLevel&&(this.value=t.startingLevel),this.value>t.lastUsefulLevel&&(this.value=t.lastUsefulLevel),f()})),$("#decrementLevel").on("click",(function(){let e=$("#level").val();e>t.startingLevel&&$("#level").val(--e),f()})),$("#incrementLevel").on("click",(function(){let e=$("#level").val();e<t.lastUsefulLevel&&$("#level").val(++e),f()})),$("#reset").on("click",(function(){o=n(),$("#level").val(t.startingLevel),f()}));let o=n();f();
//# sourceMappingURL=../maps/main.js.map
