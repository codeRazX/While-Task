import variables from "./variables";
import contentTask from "./content-task";
import { adjustHeight, generateHTML, replaceClass,cutText, dateNotDay, disabledInputs, scrollToTarget,clearHTML,toUpper, getDataForm } from "./utilities";
import { editStyleStatus, showMessage, updateFormEdit } from "./interface";


const form = variables.formEdit;
const dateCompleted = variables.dateCompletedEdit;
const containerNotes = form.querySelector("#edit-container-notes");
const resetDuedate = form.querySelector(".form__edit__delete__duedate");
const editDefaultMessage = document.getElementById("edit__default__message");
const inputs = Object.keys(getDataForm(form)).map(prop => form[prop]).filter(input => input.id !== "edit-status");


export const loadTask = ()=>{
    const currentTask = contentTask.currentTask(variables.modalEdit.dataset.task);
    
    loadProperties(currentTask);
    
    variables.formEdit.querySelectorAll("TEXTAREA").forEach(area => {
        adjustHeight(area,"2rem");
    })

    variables.subtmitBtnEdit.disabled = true;
}

const loadProperties = (task)=>{
    const data = getDataForm(form);

    for(const prop in data){
       
        const updateProp =  prop.split("-")[1];
        if(task[updateProp] !== undefined){
            form[prop].value = task[updateProp];
        }
      
    }
    loadNotes(task);
    checkMoreInfo(task);
}

const checkMoreInfo = (task)=>{
    
    if(task.status ==="completed"){
        replaceClass(dateCompleted,"disabled","active");     
        dateCompleted.value = task.dateCompleted;
        disabledInputs(inputs);
        editDefaultMessage.textContent ="*This task is marked as completed. To edit it, change its status";
    }
    else{
        replaceClass(dateCompleted,"active","disabled");
        const hasInputDisabled = inputs.every(input => input.classList.contains("disabled__input"));

        hasInputDisabled && inputs.forEach(input => input.classList.remove("disabled__input"));
        editDefaultMessage.textContent ="*You can click on a property to edit it";
    }

    if(task.completedDuedate){
        replaceClass(resetDuedate,"disabled","active");

        resetDuedate.onclick = ()=>{
            
            if(form["edit-status"].value ==="completed")return;
            form["edit-duedate"].value ="";
            form["edit-timeDuedate"].value ="";
            task.completedDuedate = "";
            variables.subtmitBtnEdit.disabled = false;
        }
    }
    else{
        replaceClass(resetDuedate,"active","disabled");
    }

}

const loadNotes = (task)=>{

    clearHTML(containerNotes,true);

    if(task.note.length === 0){
        const defaultNote = generateHTML("P","form__edit__value form__edit__value__notes__defaut","No notes stored");
        containerNotes.appendChild(defaultNote);
    }
    else{
        task.note.forEach((note) => {
           generateNote(note.note,note.id);
        })
    }
    
}


const validateForm = ()=>{
    let isValid = true;
    const inputs = [form["edit-title"],form["edit-description"]];
   
    inputs.forEach(input => {
        if(input.value.trim() === ""){
            showMessage("error",input.parentElement,"This field is required");
            isValid = false;
        }
    })
    return isValid;
}


const checkMaxValue = (text,target)=>{
     if(target.id.includes("title")){    
        target.value = cutText(text,variables.maxLengthTitle(),true,target.parentElement);
     }
     else if(target.id.includes("description")){     
         target.value = cutText(text,variables.maxLengthDescription(),true,target.parentElement);
     }
     else if(target.classList.contains("note__edit")){
        target.value = cutText(text,variables.maxLengthNote(),true,target.parentElement);
     }
}

export const checkMaxValuePaste = (e)=>{
    const target = e.target;
    const currentScroll = form.scrollTop;
    const scrollHeight = form.scrollHeight;
    const clientHeight = form.clientHeight;

    if (target.tagName === 'TEXTAREA') {
     e.preventDefault();

     let pastedText = e.clipboardData.getData('text');
     let newText = target.value.slice(0, target.selectionStart) + pastedText + target.value.slice(target.selectionStart);
    
     checkMaxValue(newText,target);
     adjustHeight(target);
     fixScroll(currentScroll,scrollHeight,clientHeight);
    }
}

const fixScroll = (currentScroll,scrollHeight,clientHeight)=>{
    const isNearBottom = scrollHeight - currentScroll - clientHeight < variables.offsetScroll;
  
    if (isNearBottom) {
        form.scrollTop = scrollHeight;
    }
  }


const generateNote = (content,id)=>{
    const noteEL = generateHTML("TEXTAREA","form__edit__value note__edit");
    noteEL.value =  content;
    const blockNote = generateHTML("div","form__edit__value__note","","","",noteEL);
    noteEL.dataset.id = id;
    containerNotes.appendChild(blockNote);
    return blockNote;
}

const addNote = ()=>{
    const dataID = containerNotes.querySelectorAll('[data-id]').length;
    const messageDefault = containerNotes.querySelector(".form__edit__value__notes__defaut");
    messageDefault && messageDefault.remove();

    const newNote = generateNote("Write your note here!", dataID + 1);
    newNote && newNote.classList.add("appearNote");

    adjustHeight(newNote.firstChild);
    scrollToTarget(newNote);
}

const editTask = ()=>{
    
    const data = getDataForm(form);
    const notesEdit = containerNotes.querySelectorAll('[data-id]');
    
    if(notesEdit.length > 0){
        data["edit-note"] = [];

        notesEdit.forEach((note) => {
            if(note.value !== ""){
                data["edit-note"].push({note: toUpper(note.value), isNew: true});
            }
        });
    }

    const currentTask = contentTask.currentTask(variables.modalEdit.dataset.task);
    currentTask.setValueNew(true);
    currentTask.edit(data);
}

export const handleModalInput = (e)=>{
   
    const target = e.target;
    const currentScroll = form.scrollTop;
    const scrollHeight = form.scrollHeight;
    const clientHeight = form.clientHeight;

    if(target.matches("TEXTAREA")){
        adjustHeight(e.target);
    }

    checkMaxValue(target.value,target);

    if(variables.subtmitBtnEdit.disabled){
        variables.subtmitBtnEdit.disabled = false;
    }
    
    fixScroll(currentScroll,scrollHeight,clientHeight);
}

export const handleModalActions = (e)=>{
    if(e.target === variables.subtmitBtnEdit){
        if(!validateForm())return;
        editTask();
        updateFormEdit();
    }
    else if(e.target === variables.addNoteEdit && form["edit-status"].value!=="completed"){     
        addNote();
    }
  
}



const changesForm = (target)=>{
    
    if(target.value ==="completed"){

        if (target.value === "completed") {
            const newDateCompleted = dateNotDay();

            dateCompleted.value = newDateCompleted;
            form["edit-duedate"].value = "";
            form["edit-timeDuedate"].value = "";
            disabledInputs(inputs);

            dateCompleted.classList.contains("disabled") && replaceClass(dateCompleted, "disabled", "active"); 
            
            editDefaultMessage.textContent ="*This task is marked as completed. To edit it, change its status";
        } 
    }
    else {
     
        if (dateCompleted.classList.contains("active")) {
            replaceClass(dateCompleted, "active", "disabled");
            inputs.forEach(input => input.classList.remove("disabled__input"));
            dateCompleted.value = "";
            editDefaultMessage.textContent ="*You can click on a property to edit it";
        }
    }
   
}

export const observerChanges = (e)=>{
   
    if(e.target.id ==="edit-status"){
        editStyleStatus(e.target.value);
        changesForm(e.target);
    }
}

       