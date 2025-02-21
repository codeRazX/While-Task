import  {storage}  from "./storage";
import { renderTask } from "./interface";
import Task from "./Task";
import { clearHTML } from "./utilities";
import variables from "./variables";

const task = (function(){

    const myTask = []; 
    let isRendering = false;
    const getTask = ()=> myTask;
    const setTask = (task)=> myTask.push(task);
    const printTask = (array = myTask)=>{
        clearHTML(variables.containerTask);
        if(array.length >= 1){
            sortArray(array);
            array.forEach(task =>{
                task.create(); 
            })

            checkRenderTime();
        }
       
        console.log(myTask);
    }

    const getUpdateTask = ()=>{
        storage.getStorage().length>= 1? myTask.splice(0,myTask.length,...storage.getStorage().map(task => new Task(task))) : myTask.splice(0,myTask.length);
    };

    const updateDataTask = ()=>{
        storage.setStorage(myTask);
        getUpdateTask();
        printTask();
    }

    const checkRenderTime = ()=>{
       
        isRendering = myTask.some(task => task.completedDuedate);
        if(isRendering)renderTask();
    }

    const isRenderingControl = ()=> isRendering;
   
    const currentTask = (id)=> myTask[myTask.findIndex(task => task.id === parseInt(id))];
    
    const sortArray = (array)=>{
        array.sort((a, b) => {
            if (a.priority !== b.priority) {
              return a.priority - b.priority;
            }
            const dateA = new Date(a.sortDate);
            const dateB = new Date(b.sortDate);

            return dateB.getTime() - dateA.getTime(); 
          });
          
    }
    const clearTask = ()=> myTask.splice(0,myTask.length);

    getUpdateTask();
    
    return{getTask,setTask, printTask, currentTask, getUpdateTask, updateDataTask, isRenderingControl,clearTask}
})();
export default task;