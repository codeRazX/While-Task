import variables from "./variables";
import contenTask from "./content-task";
import { desactivedEl,activeEl, replaceClass,generateHTML,calculateRemainingTime,dateNotDay,cutText} from "./utilities";
import dataAction from "./handle-action";



const animatedModalGeneric = (modal)=>{
    modal.classList.toggle("modal__anim__close");
    variables.overlay.classList.toggle("overlay__close");

    setTimeout(()=>{
        modal.classList.toggle("modal__anim__close");
        variables.overlay.classList.toggle("overlay__close");
        desactivedEl(variables.overlay);
        desactivedEl(variables.modal);
        modal !== variables.modal? modal.remove() : variables.form.reset();
    },300);
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
    animatedModalGeneric(variables.modal);
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
            animatedModalGeneric(modalElement);
            showMessage("notification",document.body,"Note successfully added to this task!");   
        }
        else{
            showMessage("error",divBtn,"This field is requerid");
        }
        
    }
    btnClose.onclick = ()=> {
        animatedModalGeneric(modalElement);
    }
    document.body.appendChild(modalElement);
}
const popupNotes = (note)=>{
    activeEl(variables.overlay);
    const content = generateHTML("P","modal__notes__text",note);
    const btnClose = generateHTML("SPAN","modal__notes__close","X");
    const modalElement = generateHTML("DIV","modal__notes modal__notes__modify","","","",content,btnClose);

    btnClose.onclick = ()=> {
        animatedModalGeneric(modalElement);
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
        animatedModalGeneric(modalElement);
    }
    btnSecondary.onclick = ()=> {
        callbackSecondary(btnSecondary);
        animatedModalGeneric(modalElement);
    }
    btnClose.onclick = ()=> {
        animatedModalGeneric(modalElement);
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

export const defaultMessage = ()=>{
    contenTask.getTask().length >= 1? variables.defaultMessage.className = "disabled": variables.defaultMessage.className = "active";
}
const handleViewport = (e)=>{
    const hasMenuOpen = variables.board.querySelector(".actived-menu");
    const target = e.target;
   
    if(hasMenuOpen && target.dataset.action !== variables.actions().openMenu){
        replaceClass(hasMenuOpen,"actived-menu","disabled");
    }

    if(target){
        if(target === variables.overlay){
            const modalConfirm = document.querySelector(".modal__confirm");
            const popupNotes= document.querySelector(".modal__notes");
            variables.modal.style.display === "block" &&  animatedModalGeneric(variables.modal); 
            // variables.modalEdit.style.display === "block" && animatedModalGeneric(variables.modalEdit); 
            modalConfirm && animatedModalGeneric(modalConfirm);
            popupNotes &&  animatedModalGeneric(popupNotes);
        } 
                
        if(target === variables.btnAdd){
            activeEl(variables.modal);
            activeEl(variables.overlay);
        }
    
        target.classList.contains("modal__close") && animatedModalGeneric(variables.modal)    
    }
    else{return};   
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
      contenTask.updateDataTask();
    }

    frameCount = 0;
  }

  
  frameCount++;
  
  if(contenTask.isRenderingControl()){
    requestAnimationFrame(renderTask);
  }
  
};

document.addEventListener("DOMContentLoaded",registerInit);

function registerInit(){
   
    defaultMessage();
    updateDate();
    contenTask.printTask();
    variables.board.addEventListener("click",handleBoard);
    document.body.addEventListener("click",handleViewport);
}



const handleBoard = (e)=>{
    const target = e.target;
    const task = target.closest(".task");
    const actionType = target.dataset?.action || target.closest('[data-action]')?.dataset?.action || "";

    if(!task || !actionType)return;
    const actions = dataAction.getAction();
    if(!actions.hasOwnProperty(actionType))return;

    const selectedTask = contenTask.currentTask(task.dataset.id);
    const note = target.closest(".task__notes__block") || "";
    actions[actionType]({modalConfirm,popupNotes,modalNotes, target,task,selectedTask, note});
 }


 