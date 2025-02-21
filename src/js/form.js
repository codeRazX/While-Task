import variables from "./variables";
import { showMessage, updateFormSucces } from "./interface";
import arrayTask from "./content-task";
import Task from "./Task";
import { toUpper, cutText } from "./utilities";


const validateForm = (inputs) => {
    let isValid = true;

    for (const prop in inputs) {
        if (prop === "title" || prop === "description") {
            if (inputs[prop] === "" || inputs[prop] === undefined) {
               
                showMessage("error", variables.form[prop].parentElement,"This field is required");
                isValid = false;
            }
        }
        
        if (prop === "priority") {
            const priorityChecked = variables.form.querySelector('input[name="priority"]:checked');
            if (!priorityChecked) {
                showMessage("error", variables.form.querySelector('input[name="priority"]').parentElement.parentElement.parentElement,"This field is required");
                isValid = false;
            }
        }
    }

    return isValid;
}

export const validateLength = (e)=>{
    const target = e.target;
    if(target.id.includes("title")){    
        target.value = cutText(target.value,variables.maxLengthTitle(),true,target.parentElement);
     }
     else if(target.id.includes("description")){     
         target.value = cutText(target.value,variables.maxLengthDescription(),true,target.parentElement);
       
     }
     else if(target.id.includes("note")){
        target.value = cutText(target.value,variables.maxLengthNote(),true,target.parentElement);
     }

}
export const handleForm = (e)=>{
    e.preventDefault();
    
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    const inputs= {
        title:toUpper(variables.form.title.value.trim()),
        description: toUpper(variables.form.description.value.trim()),
        priority: variables.form.querySelector('input[name="priority"]:checked')?.value,
        duedate: variables.form.duedate.value,
        timeDuedate: variables.form["time-duedate"].value,
        status: variables.form.status.value,
        note: (variables.form.note.value.trim())? [{note:toUpper(variables.form.note.value.trim()), isNew: true}] : [],
    }
    if(!validateForm(inputs))return;
   
    arrayTask.setTask(new Task(inputs));
    arrayTask.updateDataTask();
    updateFormSucces();
}
