var W=Object.defineProperty;var X=(g,a,e)=>a in g?W(g,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):g[a]=e;var V=(g,a,e)=>(X(g,typeof a!="symbol"?a+"":a,e),e);import{a as x,q as G,g as j,d as J,b as Y,z as q,W as Z,O as ee,X as se,Y as te,Z as ne,_ as oe}from"./element-plus-e0afdb96.js";import{q as H,r as b,z as ae,aX as h,C as _,D as m,W as t,P as n,E as s,T as A,V as U,ak as B,G as le,U as K,S as re,al as ie,a2 as ce,I as de}from"./vendor-0fc5911b.js";import{u as ue,_ as F}from"./index-f85dc148.js";import"./supabase-043902eb.js";class pe{constructor(){V(this,"baseURL","/api")}async sendMessage(a,e,l){var u;const c=((u=a[a.length-1])==null?void 0:u.content)||"",d=await fetch(`${this.baseURL}/deepseek-chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:c,conversationId:e,userId:l})});if(!d.ok){const p=await d.json();throw new Error(p.error||`API请求失败: ${d.statusText}`)}const f=await d.json();return{id:`chatcmpl_${Date.now()}`,object:"chat.completion",created:Math.floor(Date.now()/1e3),model:"deepseek-chat",choices:[{index:0,message:{role:"assistant",content:f.response},finish_reason:"stop"}],usage:{prompt_tokens:0,completion_tokens:0,total_tokens:0}}}async analyzePoem(a,e,l){const c=`你是一个专业的诗词分析AI助手。请对用户提供的诗词进行专业解析：

**解析要求：**
1. 分析诗词的主题思想和情感表达
2. 解析诗词的艺术特色和修辞手法
3. 介绍诗人的创作背景和文学风格
4. 解释诗词中的文化典故和历史背景
5. 提供分层的详细解析（字词→意象→整体意境）

**回答格式：**
- 语言优美，富有文学气息
- 结构清晰，层次分明
- 结合具体诗句进行分析
- 适当引用相关诗词进行对比`,d=e||l?`请分析以下诗词：
${a}

${e?`诗人：${e}`:""}
${l?`背景信息：${l}`:""}`:`请分析以下诗词：${a}`,f=[{role:"system",content:c},{role:"user",content:d}];try{return(await this.sendMessage(f,"poem_analysis")).choices[0].message.content}catch(u){throw console.error("诗词分析失败:",u),new Error("诗词分析服务暂时不可用，请稍后重试")}}async introducePoet(a){const l=[{role:"system",content:`你是一个专业的文学研究AI助手。请详细介绍指定的诗人：

**介绍要求：**
1. 诗人的生平和重要经历
2. 诗人的文学成就和代表作品
3. 诗人的创作风格和艺术特色
4. 诗人在文学史上的地位和影响
5. 相关的历史背景和文化环境

**回答格式：**
- 内容详实，信息准确
- 结构清晰，重点突出
- 语言专业但不失生动
- 适当引用诗人的代表诗句`},{role:"user",content:`请详细介绍诗人：${a}`}];try{return(await this.sendMessage(l,"poet_introduction")).choices[0].message.content}catch(c){throw console.error("诗人介绍失败:",c),new Error("诗人介绍服务暂时不可用，请稍后重试")}}}const P=new pe,_e={class:"ai-chat-assistant"},me={class:"chat-header"},fe={class:"assistant-info"},ve={class:"message-avatar"},ge={class:"message-content"},he={class:"message-bubble"},ye={key:0,class:"user-message"},we={key:1,class:"assistant-message"},ke={key:0,class:"loading-dots"},Ce=["innerHTML"],xe={key:0,class:"message-actions"},Ae={class:"input-container"},$e={class:"input-actions"},Ie={class:"quick-actions"},Ee="/default-avatar.png",N="/ai-assistant.png",Me=H({__name:"AIChatAssistant",setup(g){const a=ue(),e=b([]),l=b(""),c=b(!1),d=b(),f=[{text:"解析《静夜思》",prompt:"请帮我解析李白的《静夜思》"},{text:"介绍李白",prompt:"请介绍一下诗人李白的生平和创作特点"},{text:"唐诗特点",prompt:"唐诗的主要特点是什么？"},{text:"宋词格式",prompt:"宋词的基本格式和韵律要求是什么？"}],u=async i=>{try{const o=i.toLowerCase();if(["诗","词","诗人","解析","分析","李白","杜甫","苏轼","静夜思","唐诗","宋词"].some(k=>o.includes(k))){const k=i.match(/(《([^》]+)》|"([^"]+)"|'([^']+)'|([^，。！？]+诗)|([^，。！？]+词))/),C=i.match(/(李白|杜甫|苏轼|白居易|王维|李清照|辛弃疾|陆游|陶渊明)/);if(k){const E=k[1],M=C?C[1]:void 0;return M?await P.analyzePoem(E,M):await P.analyzePoem(E)}else if(C)return await P.introducePoet(C[1])}const y=[{role:"system",content:`你是一个专业的诗词AI助手，专门帮助用户理解古典诗词和文化。请用中文回答，回答要专业、详细且富有文化内涵。

**你的核心能力：**
1. 解析诗词的意境和情感
2. 分析诗词的艺术特色和修辞手法  
3. 介绍诗人的生平和创作背景
4. 比较不同诗词的异同
5. 提供诗词创作建议
6. 解答诗词相关的文化知识问题

**回答要求：**
- 保持回答的专业性和准确性
- 语言优美，富有文学气息
- 结构清晰，层次分明
- 适当引用相关诗词进行对比

如果用户的问题与诗词无关，请礼貌地引导用户关注诗词相关内容。`},{role:"user",content:i}];return(await P.sendMessage(y,"general_chat")).choices[0].message.content}catch(o){throw console.error("DeepSeek API调用失败:",o),new Error("AI服务暂时不可用，请稍后重试")}},p=async()=>{if(!l.value.trim()||c.value)return;const i=l.value.trim();l.value="",e.value.push({role:"user",content:i,timestamp:Date.now()});const o={role:"assistant",content:"",isLoading:!0,timestamp:Date.now()};e.value.push(o),c.value=!0,L();try{const v=await u(i),I=e.value.length-1;e.value[I]={role:"assistant",content:v,isLoading:!1,timestamp:Date.now()}}catch(v){console.error("DeepSeek回复失败:",v),x.error(v instanceof Error?v.message:"回复生成失败，请重试"),e.value.pop()}finally{c.value=!1,L()}},D=i=>{l.value=i.prompt},S=async i=>{try{await navigator.clipboard.writeText(i.replace(/<\/?[^>]+(>|$)/g,"")),x.success("已复制到剪贴板")}catch(o){console.error("复制失败:",o),x.error("复制失败")}},$=i=>{if(!a.isAuthenticated){x.warning("请先登录以保存分析");return}x.success("分析已保存到个人收藏")},z=()=>{e.value=[],x.info("对话已清空")},T=i=>i.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>").replace(/- (.*?)(<br>|$)/g,"• $1<br>"),L=()=>{de(()=>{d.value&&(d.value.scrollTop=d.value.scrollHeight)})};return ae(()=>{e.value.push({role:"assistant",content:"您好！我是诗词AI助手，可以帮您解析诗词、介绍诗人、解答文学问题。请告诉我您想了解的内容！",timestamp:Date.now()}),L()}),(i,o)=>{const v=G,I=h("Refresh"),y=j,w=J,k=h("DocumentCopy"),C=h("Star"),E=Y,M=h("Promotion"),O=q;return _(),m("div",_e,[t(O,{class:"chat-container"},{header:n(()=>[s("div",me,[s("div",fe,[t(v,{size:32,src:N}),o[1]||(o[1]=s("span",{class:"assistant-name"},"诗词AI助手",-1))]),t(w,{type:"text",onClick:z},{default:n(()=>[t(y,null,{default:n(()=>[t(I)]),_:1}),o[2]||(o[2]=A(" 清空对话 ",-1))]),_:1})])]),default:n(()=>[s("div",{class:"messages-container",ref_key:"messagesContainer",ref:d},[(_(!0),m(U,null,B(e.value,(r,R)=>(_(),m("div",{key:R,class:le(["message",r.role])},[s("div",ve,[t(v,{size:32,src:r.role==="user"?Ee:N},null,8,["src"])]),s("div",ge,[s("div",he,[r.role==="user"?(_(),m("div",ye,K(r.content),1)):(_(),m("div",we,[r.isLoading?(_(),m("div",ke,[...o[3]||(o[3]=[s("span",null,null,-1),s("span",null,null,-1),s("span",null,null,-1)])])):(_(),m("div",{key:1,innerHTML:T(r.content)},null,8,Ce))]))]),r.role==="assistant"&&!r.isLoading?(_(),m("div",xe,[t(w,{type:"text",size:"small",onClick:Q=>S(r.content)},{default:n(()=>[t(y,null,{default:n(()=>[t(k)]),_:1}),o[4]||(o[4]=A(" 复制 ",-1))]),_:1},8,["onClick"]),t(w,{type:"text",size:"small",onClick:Q=>$(r.content)},{default:n(()=>[t(y,null,{default:n(()=>[t(C)]),_:1}),o[5]||(o[5]=A(" 保存分析 ",-1))]),_:1},8,["onClick"])])):re("",!0)])],2))),128))],512),s("div",Ae,[t(E,{modelValue:l.value,"onUpdate:modelValue":o[0]||(o[0]=r=>l.value=r),type:"textarea",rows:3,placeholder:"请输入您想了解的诗词或诗人...",disabled:c.value,onKeydown:ie(ce(p,["exact","prevent"]),["enter"])},null,8,["modelValue","disabled","onKeydown"]),s("div",$e,[s("div",Ie,[(_(),m(U,null,B(f,r=>t(w,{key:r.text,type:"text",size:"small",onClick:R=>D(r)},{default:n(()=>[A(K(r.text),1)]),_:2},1032,["onClick"])),64))]),t(w,{type:"primary",loading:c.value,onClick:p,disabled:!l.value.trim()},{default:n(()=>[t(y,null,{default:n(()=>[t(M)]),_:1}),o[6]||(o[6]=A(" 发送 ",-1))]),_:1},8,["loading","disabled"])])])]),_:1})])}}});const be=F(Me,[["__scopeId","data-v-4ee84433"]]),Pe={class:"ai-chat-page"},De={class:"header-info"},Se={class:"feature-header"},ze={class:"feature-header"},Te={class:"feature-header"},Le=H({__name:"AIChat",setup(g){return(a,e)=>{const l=ee,c=se,d=h("Reading"),f=j,u=q,p=te,D=h("User"),S=h("QuestionFilled"),$=ne,z=oe,T=Z;return _(),m("div",Pe,[t(T,null,{default:n(()=>[t(c,{class:"page-header"},{default:n(()=>[e[2]||(e[2]=s("h1",null,"诗词AI助手",-1)),s("div",De,[t(l,{type:"success"},{default:n(()=>[...e[0]||(e[0]=[A("在线",-1)])]),_:1}),e[1]||(e[1]=s("span",{class:"assistant-desc"},"智能解析诗词，解答文学问题",-1))])]),_:1}),t(z,null,{default:n(()=>[t(be),t($,{gutter:20,class:"features-section"},{default:n(()=>[t(p,{span:8},{default:n(()=>[t(u,{shadow:"hover",class:"feature-card"},{header:n(()=>[s("div",Se,[t(f,{size:"24",color:"#409eff"},{default:n(()=>[t(d)]),_:1}),e[3]||(e[3]=s("span",null,"诗词解析",-1))])]),default:n(()=>[e[4]||(e[4]=s("p",null,"深度解析诗词的意境、修辞手法、历史背景，帮助您更好地理解诗歌内涵。",-1))]),_:1})]),_:1}),t(p,{span:8},{default:n(()=>[t(u,{shadow:"hover",class:"feature-card"},{header:n(()=>[s("div",ze,[t(f,{size:"24",color:"#67c23a"},{default:n(()=>[t(D)]),_:1}),e[5]||(e[5]=s("span",null,"诗人介绍",-1))])]),default:n(()=>[e[6]||(e[6]=s("p",null,"详细介绍诗人的生平经历、创作风格、代表作品，了解文学大家的故事。",-1))]),_:1})]),_:1}),t(p,{span:8},{default:n(()=>[t(u,{shadow:"hover",class:"feature-card"},{header:n(()=>[s("div",Te,[t(f,{size:"24",color:"#e6a23c"},{default:n(()=>[t(S)]),_:1}),e[7]||(e[7]=s("span",null,"文学问答",-1))])]),default:n(()=>[e[8]||(e[8]=s("p",null,"解答关于古典文学、诗词格律、文学史等方面的疑问，满足您的求知欲。",-1))]),_:1})]),_:1})]),_:1}),t(u,{class:"examples-section"},{header:n(()=>[...e[9]||(e[9]=[s("span",null,"使用示例",-1)])]),default:n(()=>[t($,{gutter:16},{default:n(()=>[t(p,{span:6},{default:n(()=>[...e[10]||(e[10]=[s("div",{class:"example-item"},[s("h4",null,"基础解析"),s("p",null,'"解析《静夜思》的意境"'),s("p",null,'"《水调歌头》表达了什么情感"')],-1)])]),_:1}),t(p,{span:6},{default:n(()=>[...e[11]||(e[11]=[s("div",{class:"example-item"},[s("h4",null,"诗人研究"),s("p",null,'"介绍李白的创作特点"'),s("p",null,'"杜甫的现实主义风格"')],-1)])]),_:1}),t(p,{span:6},{default:n(()=>[...e[12]||(e[12]=[s("div",{class:"example-item"},[s("h4",null,"文学知识"),s("p",null,'"唐诗和宋词的区别"'),s("p",null,'"什么是婉约派"')],-1)])]),_:1}),t(p,{span:6},{default:n(()=>[...e[13]||(e[13]=[s("div",{class:"example-item"},[s("h4",null,"创作指导"),s("p",null,'"如何赏析一首诗"'),s("p",null,'"诗词创作的基本要求"')],-1)])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})])}}});const Ne=F(Le,[["__scopeId","data-v-166a8299"]]);export{Ne as default};
