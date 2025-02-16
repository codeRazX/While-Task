import  {storage}  from "./storage";
import { clearHTML,renderTask } from "./interface";
import Task from "./Task";


const task = (function(){

    const myTask = []; 
    let isRendering = false;
    const getTask = ()=> myTask;
    const setTask = (task)=> myTask.push(task);
    const printTask = ()=>{
        clearHTML();
        if(myTask.length >= 1){
            sortArray();
            myTask.forEach(task =>{
                task.create(); 
            })
        }
        checkRenderTime();
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
    
    const sortArray = ()=>{
        myTask.sort((a, b) => {
            if (a.priority !== b.priority) {
              return a.priority - b.priority;
            }
            const dateA = new Date(a.completedDate);
            const dateB = new Date(b.completedDate);

            return dateB.getTime() - dateA.getTime(); 
          });
          
          
          
    }
  
    getUpdateTask();
    return{getTask,setTask, printTask, currentTask, getUpdateTask, updateDataTask, isRenderingControl}
})();
export default task;