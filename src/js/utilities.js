
export const toUpper = (el)=> el.charAt(0).toUpperCase() + el.slice(1);
export const toLower = el => el.toLowerCase();


export const currentDate = ()=>{
   
    const date = new Date();
   
    const formattedDate = date.toLocaleDateString(undefined,{
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const formattedTime = date.toLocaleTimeString(undefined, {
        hour: '2-digit',    
        minute: '2-digit',  
        second: '2-digit',  
        hour12: false        
      });
      const finalDate = `${formattedDate} - ${formattedTime}`;
      return toUpper(finalDate);
}

export const toDateString = (dateString)=>{
  if(!dateString)return;
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString(undefined,{
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return formattedDate;
}

export const dateNotDay = ()=>{
  const date = new Date();
   
  const formattedDate = date.toLocaleDateString(undefined,{
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
   
    return formattedDate;
}


export const calculateRemainingTime = (dateString) => {
  if (!dateString) return;

  const currentDate = new Date();
  let targetDate;
  
  targetDate = (dateString.includes("-")) ? new Date(dateString) : new Date(currentDate.toDateString() + " " + dateString);
  
  
 
  !dateString.includes(":") && targetDate.setHours(0, 0, 0, 0);
  
  if (isNaN(targetDate)) return { days: 0, hours: 0, minutes: 0 };
  
  const currentTime = currentDate.getTime(); 
  const targetTime = targetDate.getTime(); 
  const remTime = targetTime - currentTime;
  
  if (remTime <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds:0 };
  }
  
  const seconds = Math.floor(remTime / 1000);
  const minutesRemaining = Math.floor(seconds / 60);
  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const daysRemaining = Math.floor(hoursRemaining / 24);
  
  const totalHours = hoursRemaining % 24;
  const totalMinutes = minutesRemaining % 60;
  const totalSeconds = seconds % 60;
  
  //  console.log(`Tiempo Restante: ${daysRemaining} días, ${totalHours} horas, ${totalMinutes} minutos, ${totalSeconds} segundos`);
  
  return { days: daysRemaining, hours: totalHours, minutes: totalMinutes, seconds };
  
  }


export const generateHTML = (el,clase = "",content = "",src="",alt="",...childs)=>{
  const item = document.createElement(el);
  if(clase)item.className = clase;
  if(src)item.src = src;
  if(alt)item.alt = alt;
  if(content)item.textContent = content;
  if(childs)item.append(...childs);
  return item;
}

export const cutText = (text,max) =>{
 
  if(text.length >= max){
    return text.slice(0,max) + "...";
  }
  return text;
}

export const activeEl = el => el.style.display = "block";
export const desactivedEl = el => el.style.display = "none";
export const replaceClass = (el,currentClass,newClass) => el.classList.replace(currentClass,newClass);