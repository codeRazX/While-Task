import variables from "./variables";
import contenTask from "./content-task";
import { desactivedEl,activeEl, replaceClass,generateHTML,toUpper,calculateRemainingTime,dateNotDay,cutText} from "./utilities";


const openModal = ()=>{
    activeEl(variables.modal);
    activeEl(variables.overlay);
}
const closeModal = e =>{
    if(e.target.classList.contains("modal__close")){
        animatedCloseModal();
    }
}
const animatedCloseModal = ()=>{
    variables.modal.classList.toggle("modal__anim__close");
    variables.overlay.classList.toggle("overlay__close");

    setTimeout(()=>{
        variables.modal.classList.toggle("modal__anim__close");
        variables.overlay.classList.toggle("overlay__close");
        desactivedEl(variables.overlay);
        desactivedEl(variables.modal);
        variables.form.reset();
    },300);
}
const animatedCloseModalGeneric = (modal)=>{
    modal.classList.toggle("modal__anim__close");
    variables.overlay.classList.toggle("overlay__close");

    setTimeout(()=>{
        modal.remove();
        variables.overlay.classList.toggle("overlay__close");
        desactivedEl(variables.overlay);
    },200);
}
const disabledOverlay = e =>{
 
    if(e.target === variables.overlay){
        const modalConfirm = document.querySelector(".modal__confirm");
        const modalNotes= document.querySelector(".modal__notes");

        if(variables.modal.style.display === "block"){
            animatedCloseModal();
        }
        if(modalConfirm){
           animatedCloseModalGeneric(modalConfirm);
        }
        if(modalNotes){
            animatedCloseModalGeneric(modalNotes);
         }
    }
}

export const showMessage = (type, container, content)=>{
    const hasMessage = container.querySelector(".error") || container.querySelector(".notification");
    if(hasMessage)hasMessage.remove();
    const message = document.createElement("P");
    switch(type){
        case "error":
        message.classList.add("error");
        break;

        case "notification":
        message.classList.add("notification");
        break;
    }
    message.textContent = content;
    setTimeout(()=>message.remove(),4000)
    container.appendChild(message);
}

const updateDate = ()=>{
    const today = new Date();

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear()+1);

    const dateMin = today.toISOString().split('T')[0];
    const dateMax = maxDate.toISOString().split('T')[0];

    variables.form.duedate.setAttribute("min",dateMin);
    variables.form.duedate.setAttribute("max",dateMax);
}

export const updateFormSucces = ()=>{
    variables.form.reset();
    showMessage("notification",document.body,"Task added successfully!");
    animatedCloseModal();
    defaultMessage();
}

const modalNotes = (task)=>{
    activeEl(variables.overlay);
    
    const notesCount = task.getNotes();
    const btnClose = generateHTML("SPAN","modal__notes__close","X");
    const title = generateHTML("P","modal__notes__text");
    const area = generateHTML("TEXTAREA");
    const btnSave = generateHTML("BUTTON","btn","Save Note");
    const divBtn = generateHTML("DIV","modal__notes__btn","","","",btnSave);
    area.placeholder = "Write your note here!";
    title.textContent= task.getNotes()>= 1? `Currently, you have ${notesCount} notes saved. Would you like one more?` : "Currently, you don't have any notes saved. Would you like to add your first note?";
    const modalElement = generateHTML("DIV","modal__notes","","","",btnClose,title,area,divBtn);

    btnSave.onclick = ()=>{
        
        if(area.value.trim() !== ""){
            task.pushNote(area.value.trim());
            animatedCloseModalGeneric(modalElement);
            showMessage("notification",document.body,"Note successfully added to this task!");   
        }
        else{
            showMessage("error",divBtn,"This field is requerid");
        }
        
    }
    btnClose.onclick = ()=> {
        animatedCloseModalGeneric(modalElement);
    }
    document.body.appendChild(modalElement);
}

const modalConfirm = (ask, btnText1, btnText2, callbackPrimary,callbackSecondary, clas = "",priority = false,refPrimaryButton = null,refSecondaryButton = null)=>{
    activeEl(variables.overlay);
    
    const askText = generateHTML("P","",ask);
    const btnPrimary = generateHTML("BUTTON","btn modal__confirm__btn__yes",btnText1);
    const btnSecondary = generateHTML("BUTTON",`btn modal__confirm__btn__cancel ${clas}`,btnText2);
    const btnClose = generateHTML("SPAN","modal__confirm__close","X");
    const groupBtn = generateHTML("DIV","modal__confirm__btn","","","",btnPrimary,btnSecondary);
    const modalElement = generateHTML("DIV","modal__confirm","","","",askText,groupBtn,btnClose);

    if(priority){
        refPrimaryButton(btnPrimary);
        refSecondaryButton(btnSecondary);    
    }
  
    btnPrimary.onclick =()=> {
        callbackPrimary(btnPrimary);
        animatedCloseModalGeneric(modalElement);
    }
    btnSecondary.onclick = ()=> {
        callbackSecondary(btnSecondary);
        animatedCloseModalGeneric(modalElement);
    }
    btnClose.onclick = ()=> {
        animatedCloseModalGeneric(modalElement);
    }
    document.body.appendChild(modalElement);
}

export const clearHTML = ()=>{
    variables.containerTask.forEach(container =>{
        if(container.childElementCount >= 1){
            while(container.firstChild){
                container.removeChild(container.firstChild);
            }
        }
    })
}

const defaultMessage = ()=>{
    contenTask.getTask().length >= 1? variables.defaultMessage.className = "disabled": variables.defaultMessage.className = "active";
}
const closeContextMenu = (e)=>{
    const hasMenuOpen = variables.board.querySelector(".actived-menu");
    
    if(hasMenuOpen  && e.target.dataset.action !== "open-menu"){
        replaceClass(hasMenuOpen,"actived-menu","disabled");
    }
}
const contextMenuTask = target =>{

    const hasMenuOpen = variables.board.querySelector(".actived-menu");
   
    if(target.dataset.action === "open-menu" && !hasMenuOpen){
        const menu = target.nextElementSibling;
        replaceClass(menu,"disabled","actived-menu");
    }
    else if(hasMenuOpen){
        replaceClass(hasMenuOpen,"actived-menu","disabled");
    }
}

let frameCount = 0;  
export const renderTask = () => {
   
  if (frameCount >= 60) {
    let hasUpdated = false; 

    contenTask.getTask().forEach(task => {
      if (task.completedDuedate) {
        const remainingTime = calculateRemainingTime(task.completedDuedate);
      
        if (remainingTime.days <= 0 && remainingTime.hours <= 0 && remainingTime.minutes <= 0 && remainingTime.seconds <= 0) {
          task.status = "completed";
          task.duedate = "";
          task.timeDuedate = "";
          task.completedDuedate = "";
          task.dateCompleted = dateNotDay();
          task.setValueNew(true);
        
          showMessage("notification", document.body, `Task ${cutText(task.title, 10)} has expired and has been marked as completed`);
          hasUpdated = true;
        }
      }
    });

    
    if (hasUpdated) {
      contenTask.updateDataTask(contenTask.getTask());
    }

    frameCount = 0;
  }

  
  frameCount++;
  
  if(contenTask.isRenderingControl()){
    requestAnimationFrame(renderTask);
  }
  
};
  
variables.btnAdd.addEventListener("click", openModal);
variables.modal.addEventListener("click",closeModal);
variables.overlay.addEventListener("click",disabledOverlay);
document.addEventListener("DOMContentLoaded",registerInit);

function registerInit(){
   
    defaultMessage();
    updateDate();
    contenTask.printTask();
    variables.board.addEventListener("click",handleBoard);
    document.body.addEventListener("click",closeContextMenu);
}

const handleBoard = (e)=>{
    //OPEN CONTEXT MENU TASK
    contextMenuTask(e.target);

    //HANDLE ACTIONS CONTEXT MENU
    handleContextMenu(e.target); 
    
    //Handle notes ui
    handleNotes(e.target);
 }

const handleContextMenu = target =>{
        const task = target.closest(".task");
        const selectedOptionMenu = target.closest(".task__modal__menu__option");
        if(!task || !selectedOptionMenu)return;
        const selectedTask = contenTask.currentTask(task.dataset.id);

        switch(selectedOptionMenu.dataset.action){
            case "view":
                console.log("view")
            break;

            case "completed":
                modalConfirm("Do you want to mark this task as completed?","Yes","Cancel",
                ()=> {
                    task.classList.add("task__remove");
                    showMessage("notification",document.body,"Task marked as completed!");   
                    setTimeout(()=>{
                        task.classList.remove("task__remove");
                        selectedTask.setValueNew(true);
                        selectedTask.markAsCompleted();

                    },1000)   
                },
                ()=> {});
               
            break;

            case "delete":   
                
                modalConfirm("Are you sure you want to delete this task?","Yes","Cancel",
                ()=>{
                    task.classList.add("task__remove");
                    selectedTask.delete(task);
                    showMessage("notification",document.body,"Task removed from the dashboard!");
                    
                    setTimeout(()=>{
                        task.remove();
                        defaultMessage();
                    },1000);
                },
                ()=> {});                
            break;

            case "switch-status":
                modalConfirm("Which status would you like to assign?","Pending","In Progress",
                ()=> {
                    if(selectedTask.getStatus() === variables.pending())return;
                    task.classList.add("task__remove");
                    showMessage("notification",document.body,`Task status changed to ${toUpper(variables.pending())}!`);

                    setTimeout(()=>{
                        selectedTask.setValueNew(true);
                        selectedTask.switchStatus(variables.pending());
                    },1000)
                   
                  
                    
                },
                ()=>{
                    if(selectedTask.getStatus() === variables.progress())return;
                    task.classList.add("task__remove");
                    showMessage("notification",document.body,`Task status changed to In ${toUpper(variables.progress())}!`);

                    setTimeout(()=>{
                        selectedTask.setValueNew(true);
                        selectedTask.switchStatus(variables.progress());
                    },1000)
                }, 
                "btn__modify__status");        
            break;

            case "switch-priority":
                const whichPriority = selectedTask.dataPriority();
                const dataPriority = whichPriority.map(priority =>{
                    if(priority === "High")return 1;
                    if(priority ==="Medium")return 2;
                    if(priority ==="Low")return 3;
                })
               
                modalConfirm("What new priority would you like to assign?",whichPriority[0],whichPriority[1],
                    ()=> { 
                        task.classList.add("task__remove");
                        showMessage("notification",document.body,`The priority has been changed to ${whichPriority[0]}!`);       
                        setTimeout(()=>{
                            selectedTask.setValueNew(true);
                            selectedTask.switchPriority(dataPriority[0]);
                        },1000)          
                    },
                    ()=> {
                        task.classList.add("task__remove");
                        showMessage("notification",document.body,`The priority has been changed to ${whichPriority[1]}!`);
                        setTimeout(()=>{
                            selectedTask.setValueNew(true);
                            selectedTask.switchPriority(dataPriority[1]);
                        },1000)        
                    }
                    ,undefined
                    ,true
                    ,(primaryButton)=> checkButtonPriority(dataPriority[0],primaryButton),
                    (secondaryButton)=> checkButtonPriority(dataPriority[1],secondaryButton));
            break;
           
        }
        
       
}

const checkButtonPriority = (data,btn)=>{
    switch(data){
        case 1:
        btn.classList.add("btn__priority__hight");
        break;

        case 2:
        btn.classList.add("btn__priority__medium");
        break;

        case 3:
        btn.classList.add("btn__priority__low");
        break;

    }
}

const handleNotes = (target)=>{
    const action = target.dataset?.action || target.closest('[data-action]')?.dataset?.action || "";
   
    if(action && action !== "open-menu" && !target.closest(".task__modal__menu__option")){
        const taskDOM = target.closest(".task");
        const task = contenTask.currentTask(taskDOM.dataset.id);

        if(action ==="add-note"){
           console.log(task)
           modalNotes(task);
        }
        else if(action !=="add-note"){
            const dataID = target.closest(".task__notes__block").dataset?.id;

            if(action ==="open-note"){
                console.log("clickeando nota");
                task.openNote(dataID);//Hacer esta funcion
            }  
            else if(action ==="delete-note"){
                //El modal confirm abrir
                console.log(task)
                task.deleteNote(dataID);//Hacer esta funcion
                console.log("eliminando nota");
            }
        }  
        
    }

   
}
 