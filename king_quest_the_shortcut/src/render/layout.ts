import type {Location,Hotspot} from '../content/world';
// Presentation anchors registered to the painted plates; simulation IDs stay unchanged.
const anchors:Partial<Record<Location,Record<string,[number,number]>>>={
village:{thread:[175,307],mirror:[225,307],bottle:[270,307],cake:[305,307],aldus:[350,448]},
mill:{wheel:[245,278],gauge:[534,275],sluice:[566,322],capstan:[370,399],beam:[275,428],span:[715,320],stones:[775,454],ferry:[886,492],bram:[295,459]},
crossroads:{oak:[230,310],stone:[427,412],sign:[575,330]},
cottage:{lantern:[400,297],door:[500,375],coop:[900,408],ysabet:[582,488]},
chapel:{mural:[360,314],pip:[576,150],disc:[610,146]},
moonwell:{socket:[700,282],'ring-0':[318,320],'ring-1':[444,329],'ring-2':[572,333],basin:[470,399],flowers:[803,390]},
bridge:{brindle:[345,460],'bridge-key':[472,456],'toll-bell':[633,162],gate:[805,220],ledge:[215,455],'cross-bridge':[865,267]},
castle:{'main-gate':[650,350],sella:[697,493]},
tower:{bell:[520,200],yoke:[510,144],catch:[655,367],rope:[734,423],briars:[610,399]}
};
export function sceneHotspots(location:Location,hotspots:Hotspot[]):Hotspot[]{return hotspots.map(h=>{const a=anchors[location]?.[h.id];return a?{...h,x:a[0],y:a[1]}:h;});}
export const pointFor=(location:Location,id:string)=>anchors[location]?.[id];
