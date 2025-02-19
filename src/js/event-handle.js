import variables from "./variables";
import { handleForm,validateLength } from "./form";
import { handleModalInput,checkMaxValuePaste, handleModalActions,observerChanges } from "./form-edit";

const eventHandle = (()=>{

    const event = {
      
        registerEventsForm : ()=>{
            variables.form.addEventListener("submit", handleForm);
            variables.form.addEventListener("input", validateLength);
        },
        removeEventsForm : ()=>{
            variables.form.removeEventListener("submit", handleForm);
            variables.form.removeEventListener("input", validateLength);
        },
    
        
        registerEventsEdit : ()=>{
            variables.modalEdit.addEventListener("click",handleModalActions);
            variables.formEdit.addEventListener("input",handleModalInput);
            variables.formEdit.addEventListener("paste",checkMaxValuePaste);
            variables.formEdit.addEventListener("change",observerChanges);
            
        },
        removeEventsEdit : ()=>{
            variables.modalEdit.removeEventListener("click",handleModalActions);
            variables.formEdit.removeEventListener("input",handleModalInput);
            variables.formEdit.removeEventListener("paste",checkMaxValuePaste);
            variables.formEdit.removeEventListener("change",observerChanges);
        },
    }
  
    return {event};
})();

export default eventHandle;