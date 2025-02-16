import variables from "./variables";
import { showMessage, updateFormSucces } from "./interface";
import arrayTask from "./content-task";
import Task from "./Task";
import { toLower, toUpper } from "./utilities";

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
const handleForm = (e)=>{
    e.preventDefault();
    const inputs= {
        title:toUpper(toLower(variables.form.title.value.trim())),
        description: toUpper(toLower(variables.form.description.value.trim())),
        priority: variables.form.querySelector('input[name="priority"]:checked')?.value,
        duedate: variables.form.duedate.value,
        timeDuedate: variables.form["time-duedate"].value,
        status: variables.form.status.value,
        note: (variables.form.note.value.trim())? [{note:toUpper(toLower(variables.form.note.value.trim())), isNew: true}] : [],
    }
    if(!validateForm(inputs))return;
   
    arrayTask.setTask(new Task(inputs));
    arrayTask.updateDataTask();
    updateFormSucces();
  
    
}
variables.form.addEventListener("submit", handleForm);