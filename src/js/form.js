import variables from "./variables";
import { showMessage, updateFormSucces } from "./interface";
import arrayTask from "./content-task";
import Task from "./Task";
import { toUpper, cutText, getDataForm } from "./utilities";


const validateForm = (data) => {
    let isValid = true;
    
    const requiredProps = [variables.properties().title, variables.properties().description, variables.properties().priority];

    requiredProps.forEach(input => {
        if(data[input] === "" || data[input] === undefined){

            const fieldValidate = (input === variables.properties().priority)
            ? variables.form.querySelector('input[name="priority"]').parentElement.parentElement.parentElement
            : variables.form[input].parentElement;

            showMessage("error", fieldValidate, "This field is required");
            isValid = false;
    }
        
    })

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
    
    const data = getDataForm(e.target);
    data.note = (data.note !=="")? [{note:toUpper(variables.form.note.value.trim()), isNew: true}] : [];
    
    
    if(!validateForm(data))return;
   
    arrayTask.setTask(new Task(data));
    arrayTask.updateDataTask();
    updateFormSucces();
}
