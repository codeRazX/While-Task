import { showMessage,defaultMessage,editStyleStatus } from "./interface";
import { toUpper,replaceClass,activeEl,scrollToTarget,waitFor } from "./utilities";
import variables from "./variables";
import {loadTask} from "./form-edit";
import eventHandle from "./event-handle";
import task from "./content-task";

const actions = (()=>{

    const genericFunctionAction = (el,text, callback = ()=>{},clase = "task__remove")=>{
        if(el)el.classList.add(clase);
        showMessage("notification", document.body, text);
        callback();
     }

     const genericFunctionActionSetTimeOut = (selectedTask,callback = ()=>{})=>{
        selectedTask.setValueNew(true);
        callback();
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

    const action = {

        openMenu: ({target})=>{
            const hasMenuOpen = variables.board.querySelector(".actived-menu");
            if(!hasMenuOpen){
                const menu = target.nextElementSibling;
                replaceClass(menu,"disabled","actived-menu");
            }
            else if(hasMenuOpen){
                replaceClass(hasMenuOpen,"actived-menu","disabled");
            }
        },

        view: ({selectedTask})=>{
            variables.modalEdit.dataset.task = selectedTask.id;
            activeEl(variables.modalEdit);
            activeEl(variables.overlay);
            editStyleStatus(selectedTask.status);
            loadTask();
            eventHandle.event.registerEventsEdit();
        },

        completed: ({modalConfirm,task,selectedTask}) => {
            modalConfirm(
                "Do you want to mark this task as completed?", "Yes", "Cancel",
                async () => {
                    genericFunctionAction(task, "Task marked as completed!");
                    await waitFor(1000);  
                    genericFunctionActionSetTimeOut(selectedTask, () => selectedTask.markAsCompleted());
                },
                () => {}
            );
        },
        
        deleteTask: ({modalConfirm,task,selectedTask}) => {
            modalConfirm(
                "Are you sure you want to delete this task?", "Yes", "Cancel",
                async () => {
                    genericFunctionAction(task, "Task removed from the dashboard!", () => selectedTask.delete(task));
                    await waitFor(1000);
                    task.remove();
                    defaultMessage();
                },
                () => {}
            );
        },
        
        switchStatus: ({modalConfirm,task,selectedTask}) => {
            modalConfirm(
                "Which status would you like to assign?", "Pending", "In Progress",
                async () => {
                    if (selectedTask.getStatus() === variables.pending()) return;
                    genericFunctionAction(task, `Task status changed to ${toUpper(variables.pending())}!`);
                    await waitFor(1000);
                    genericFunctionActionSetTimeOut(selectedTask, () => selectedTask.switchStatus(variables.pending()));
                },
                async () => {
                    if (selectedTask.getStatus() === variables.progress()) return;
                    genericFunctionAction(task, `Task status changed to In ${toUpper(variables.progress())}!`);
                    await waitFor(1000);
                    genericFunctionActionSetTimeOut(selectedTask, () => selectedTask.switchStatus(variables.progress()));
                },
                "btn__modify__status"
            );
        },
    
        switchPriority: ({modalConfirm,task,selectedTask}) => {
            const whichPriority = selectedTask.dataPriority();
            const dataPriority = whichPriority.map(priority => {
                if (priority === "High") return 1;
                if (priority === "Medium") return 2;
                if (priority === "Low") return 3;
            });

            modalConfirm(
                "What new priority would you like to assign?", whichPriority[0], whichPriority[1],
                async () => {
                    genericFunctionAction(task, `The priority has been changed to ${whichPriority[0]}!`);
                    await waitFor(1000);
                    genericFunctionActionSetTimeOut(selectedTask, () => selectedTask.switchPriority(dataPriority[0]));
                },
                async () => {
                    genericFunctionAction(task, `The priority has been changed to ${whichPriority[1]}!`);
                    await waitFor(1000);
                    genericFunctionActionSetTimeOut(selectedTask, () => selectedTask.switchPriority(dataPriority[1]));
                },
                undefined,
                true,
                (primaryButton) => checkButtonPriority(dataPriority[0], primaryButton),
                (secondaryButton) => checkButtonPriority(dataPriority[1], secondaryButton)
            );
        },

        addNote: ({modalNotes,selectedTask})=>{
            modalNotes(selectedTask);
        },

        openNote: ({popupNotes,note,selectedTask})=>{
            popupNotes(selectedTask.viewNote(note));
        },

        deleteNote: ({modalConfirm,note,selectedTask}) => {
            modalConfirm(
                "Are you sure you want to delete this note?", "Yes", "Cancel",
                async () => {
                    genericFunctionAction(note, "Note removed from the dashboard!","","disappear");
                    await waitFor(1000);
                    selectedTask.deleteNote(note);
                },
                () => {}
            );
        },

        addTask: ()=>{
            activeEl(variables.modal);
            activeEl(variables.overlay);
            eventHandle.event.registerEventsForm();
        },
        goTop: ()=>{
           scrollToTarget(variables.btnAdd);
        },
        clearBoard: (modalConfirm)=>{
            if(task.getTask().length <= 0)return;
            modalConfirm(
                "Are you sure you want to clear your board? All your tasks will be removed", "Yes", "Cancel",
                async () => {
                    genericFunctionAction("", "All the notes have been removed from the dashboard!",async()=>{
                        await waitFor(500);
                        task.clearTask();
                        task.updateDataTask();
                        defaultMessage();
                    });
                },
                () => {}
            );
           
           
        },
        resetFilter: ()=>{
            const hasFilter = Array.from(variables.formFilter.querySelectorAll("SELECT")).some(select => select.value !=="");
            
            if(!hasFilter)return;
            variables.formFilter.reset();
            task.printTask();
        },
    };

    const getAction = ()=> action;

    return {getAction};
})();
export default actions;