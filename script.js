
"use strict";

document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded",()=>{
  const header=document.getElementById("header");
  const nav=document.getElementById("nav");
  const menuToggle=document.getElementById("menuToggle");
  const navLinks=document.querySelectorAll(".nav a");
  const filterButtons=document.querySelectorAll(".filter-btn");
  const projectCards=document.querySelectorAll(".project-card");
  const modal=document.getElementById("projectModal");
  const modalDialog=modal?.querySelector(".modal-dialog");
  const modalClose=document.getElementById("modalClose");
  const modalImage=document.getElementById("modalImage");
  const modalCount=document.getElementById("modalCount");
  const modalThumbnails=document.getElementById("modalThumbnails");
  const modalTitle=document.getElementById("modalTitle");
  const modalCategory=document.getElementById("modalCategory");
  const modalDescription=document.getElementById("modalDescription");
  const modalType=document.getElementById("modalType");
  const contactForm=document.getElementById("contactForm");
  const formFeedback=document.getElementById("formFeedback");
  const year=document.getElementById("currentYear");

  if(year)year.textContent=new Date().getFullYear();

  const image=(id,w=1500)=>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

  const projects={
    "casa-aurora":{
      title:"Casa Aurora",
      category:"ARQUITETURA RESIDENCIAL",
      type:"Residencial",
      description:"Um estudo conceitual de residência contemporânea, com espaços integrados, materiais naturais e iluminação que valoriza a experiência de morar. As imagens são referências visuais independentes e não representam uma obra executada.",
      images:[
        image("photo-1600607687920-4e2a09cf159d"),
        image("photo-1600210492486-724fe5c67fb0"),
        image("photo-1600607687939-ce8a6c25118c")
      ]
    },
    "essencia":{
      title:"Essência",
      category:"DESIGN DE INTERIORES",
      type:"Interiores",
      description:"Uma proposta visual que explora texturas, proporções e uma paleta de tons naturais. O conceito demonstra como uma apresentação digital pode valorizar a narrativa de um projeto de interiores.",
      images:[
        image("photo-1600607688969-a5bfcd646154"),
        image("photo-1600210491892-03d54c0aaf87"),
        image("photo-1600607687644-c7171b42498f")
      ]
    },
    "studio-forma":{
      title:"Studio Forma",
      category:"ESPAÇOS COMERCIAIS",
      type:"Comercial",
      description:"Conceito demonstrativo de um espaço comercial com identidade contemporânea, pensado para ilustrar o equilíbrio entre atmosfera, funcionalidade e expressão visual.",
      images:[
        image("photo-1600607687644-c7171b42498f"),
        image("photo-1600607687939-ce8a6c25118c"),
        image("photo-1600607688969-a5bfcd646154")
      ]
    },
    "refugio":{
      title:"Refúgio",
      category:"ARQUITETURA RESIDENCIAL",
      type:"Residencial",
      description:"Um estudo conceitual sobre acolhimento, iluminação natural e materiais atemporais. Fotografias independentes compõem uma experiência de navegação voltada à apresentação de projetos arquitetônicos.",
      images:[
        image("photo-1600607687920-4e2a09cf159d"),
        image("photo-1600210491892-03d54c0aaf87"),
        image("photo-1600210492486-724fe5c67fb0")
      ]
    }
  };

  // CABEÇALHO
  function updateHeader(){
    header?.classList.toggle("scrolled",window.scrollY>50);
  }
  updateHeader();
  window.addEventListener("scroll",updateHeader,{passive:true});

  // MENU MOBILE
  function closeMenu(){
    if(!nav||!menuToggle)return;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
    menuToggle.setAttribute("aria-label","Abrir menu");
  }

  menuToggle?.addEventListener("click",()=>{
    const isOpen=nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded",String(isOpen));
    menuToggle.setAttribute("aria-label",isOpen?"Fechar menu":"Abrir menu");
  });

  navLinks.forEach(link=>{
    link.addEventListener("click",closeMenu);
  });

  document.addEventListener("click",event=>{
    if(
      nav?.classList.contains("open")&&
      !nav.contains(event.target)&&
      !menuToggle?.contains(event.target)
    ){
      closeMenu();
    }
  });

  window.addEventListener("resize",()=>{
    if(window.innerWidth>850)closeMenu();
  });

  // LINKS ATIVOS
  const sections=[...document.querySelectorAll("main section[id]")];

  if("IntersectionObserver" in window){
    const sectionObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const id=entry.target.id;
        document.querySelectorAll(".nav-link").forEach(link=>{
          link.classList.toggle(
            "active",
            link.getAttribute("href")===`#${id}`
          );
        });
      });
    },{
      rootMargin:"-25% 0px -60% 0px",
      threshold:0
    });

    sections.forEach(section=>sectionObserver.observe(section));
  }

  // ANIMAÇÕES DE ENTRADA
  const revealElements=document.querySelectorAll(".reveal");
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if(reducedMotion||!("IntersectionObserver" in window)){
    revealElements.forEach(element=>element.classList.add("visible"));
  }else{
    const revealObserver=new IntersectionObserver((entries,observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },{
      threshold:0.08,
      rootMargin:"0px 0px -30px 0px"
    });

    revealElements.forEach(element=>revealObserver.observe(element));
  }

  // FILTROS DE PROJETOS
  filterButtons.forEach(button=>{
    button.addEventListener("click",()=>{
      const filter=button.dataset.filter;

      filterButtons.forEach(item=>{
        const active=item===button;
        item.classList.toggle("active",active);
        item.setAttribute("aria-pressed",String(active));
      });

      projectCards.forEach(card=>{
        const show=filter==="todos"||card.dataset.category===filter;
        card.hidden=!show;
      });
    });
  });

  // GALERIA DE PROJETOS
  let currentProject=null;
  let currentImageIndex=0;
  let previousFocus=null;

  function showImage(index){
    if(!currentProject||!modalImage||!modalThumbnails)return;

    const total=currentProject.images.length;
    currentImageIndex=(index+total)%total;

    modalImage.src=currentProject.images[currentImageIndex];
    modalImage.alt=`Referência visual ${currentImageIndex+1} do conceito ${currentProject.title}`;
    modalCount.textContent=
      `${String(currentImageIndex+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;

    modalThumbnails.replaceChildren();

    currentProject.images.forEach((src,i)=>{
      const button=document.createElement("button");
      const thumb=document.createElement("img");

      button.type="button";
      button.classList.toggle("active",i===currentImageIndex);
      button.setAttribute("aria-label",`Visualizar imagem ${i+1}`);
      button.setAttribute("aria-pressed",String(i===currentImageIndex));

      thumb.src=src;
      thumb.alt="";
      thumb.loading="lazy";

      button.appendChild(thumb);
      button.addEventListener("click",()=>showImage(i));
      modalThumbnails.appendChild(button);
    });
  }

  function openProject(projectId){
    const project=projects[projectId];
    if(!project||!modal)return;

    previousFocus=document.activeElement;
    currentProject=project;
    currentImageIndex=0;

    modalTitle.textContent=project.title;
    modalCategory.textContent=project.category;
    modalDescription.textContent=project.description;
    modalType.textContent=project.type;

    showImage(0);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");

    modalClose?.focus();
  }

  function closeProject(){
    if(!modal?.classList.contains("is-open"))return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");

    currentProject=null;

    if(modalImage){
      modalImage.removeAttribute("src");
    }

    if(previousFocus instanceof HTMLElement){
      previousFocus.focus();
    }
  }

  document.querySelectorAll("[data-project]").forEach(button=>{
    button.addEventListener("click",()=>{
      openProject(button.dataset.project);
    });
  });

  modalClose?.addEventListener("click",closeProject);

  modal?.querySelectorAll("[data-close-modal]").forEach(element=>{
    element.addEventListener("click",closeProject);
  });

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"){
      closeMenu();
      closeProject();
      return;
    }

    if(!modal?.classList.contains("is-open"))return;

    if(event.key==="ArrowRight"){
      event.preventDefault();
      showImage(currentImageIndex+1);
    }

    if(event.key==="ArrowLeft"){
      event.preventDefault();
      showImage(currentImageIndex-1);
    }

    if(event.key==="Tab"&&modalDialog){
      const focusable=[
        ...modalDialog.querySelectorAll(
          'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'
        )
      ].filter(element=>element.getClientRects().length>0);

      if(!focusable.length){
        event.preventDefault();
        modalDialog.focus();
        return;
      }

      const first=focusable[0];
      const last=focusable[focusable.length-1];

      if(event.shiftKey&&document.activeElement===first){
        event.preventDefault();
        last.focus();
      }else if(!event.shiftKey&&document.activeElement===last){
        event.preventDefault();
        first.focus();
      }
    }
  });

  // FORMULÁRIO DEMONSTRATIVO
  contactForm?.addEventListener("submit",event=>{
    event.preventDefault();

    const name=contactForm.querySelector("#contactName")?.value.trim();
    const type=contactForm.querySelector("#contactType")?.value;
    const message=contactForm.querySelector("#contactMessage")?.value.trim();

    if(!name||!type||!message){
      formFeedback.textContent=
        "Para testar a demonstração, preencha os três campos com informações fictícias.";
      return;
    }

    formFeedback.textContent=
      "Demonstração concluída. Em um site real, a solicitação seria encaminhada ao escritório. Nenhuma informação foi enviada ou armazenada.";

    contactForm.reset();
  });

  // ERROS DE IMAGEM
  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      img.classList.add("image-error");
      console.warn("Imagem indisponível:",img.currentSrc||img.src);
    });
  });
});
