// 项目差异只来自配置与模型；目录缺项保留可解释状态。
export function configureControls(cfg,meta){
 const text=(id,value)=>document.getElementById(id).textContent=value||'';
 text('brand',cfg.brand);text('project-label',cfg.projectLabel||meta.project);document.title=cfg.projectLabel||meta.project;
 text('model-note',cfg.note);text('model-note-zh',cfg.noteZh);
 const views=document.getElementById('views');views.replaceChildren();
 for(const v of cfg.views){const b=document.createElement('button');b.dataset.view=v.id;b.textContent=v.label||v.title||v.id;const sub=document.createElement('small');sub.textContent=v.label_zh||v.subtitle||'';b.append(sub);views.append(b);}
 const layerBox=document.getElementById('floor-layers');
 cfg.floor_layers=cfg.floor_layers.filter(l=>meta.components.some(c=>(!l.groups||l.groups.includes(c.group))&&(!l.floors||l.floors.includes(c.floor))));
 for(const l of cfg.floor_layers){const label=document.createElement('label');label.className='toggle';const name=document.createElement('span');name.textContent=l.label;const input=document.createElement('input');input.id='layer-'+l.id;input.type='checkbox';input.checked=true;label.append(name,input);layerBox.append(label);}
 const levels=document.getElementById('levels');for(const note of cfg.levelNotes||[]){const p=document.createElement('p');p.textContent=note.text;levels.append(p);}
 for(const id of ['roof','trusses','terrain']){const e=document.getElementById(id),available=id==='terrain'?Boolean(cfg.ground):meta.components.some(c=>c.group===id);e.dataset.unavailable=String(!available);e.disabled=!available;if(!available)e.closest('label').append(' · Not modeled / 未建模');}
 for(const b of document.querySelectorAll('[data-wall]'))b.disabled=b.dataset.wall!=='solid'&&!cfg.framing_floors.length;
 text('framing-status',cfg.framing_floors.length?'Framing follows supplied model scope / 骨架限已建楼层':'Timber framing not supplied / 无木墙骨架资料，显示完整墙');
 const surface=document.getElementById('surface');for(const kind of cfg.ground_states||[]){const o=document.createElement('option');o.value=kind;o.textContent=kind==='finished'?'Finished / 完成地形':kind==='existing'?'Existing / 现状地形':kind;surface.append(o);}surface.value=cfg.ground_default||'finished';
 for(const button of document.querySelectorAll('[data-catalog-filter]')){
  const key=button.dataset.catalogFilter;if(cfg.catalog_mappings?.[key])button.dataset.catalogFilter=cfg.catalog_mappings[key].join(' ');
  const groups=button.dataset.catalogFilter.split(' '),roles=button.dataset.catalogRole?.split(' ');
  if(!meta.components.some(c=>groups.includes(c.group)&&(!roles||roles.includes(c.role)))){button.disabled=true;button.append(' · Not modeled / 未建模');}
 }
 for(const discipline of ['arc','st'])if(cfg.disciplines&&!cfg.disciplines.includes(discipline))document.querySelector(`[data-catalog="${discipline}"]`).hidden=true;
}
