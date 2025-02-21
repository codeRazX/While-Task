import variables from "./variables"

export const storage = {
   getStorage: ()=>JSON.parse(localStorage.getItem(variables.key())) || [],
   setStorage: (value)=> localStorage.setItem(variables.key(), JSON.stringify(value)),
}