import { useState } from "react";
/* 
input field behaviour used for account creation and logging in.
It could be extended with:
    - validation support (a function with validation rules could be passed as an argument)
    - error message states 
*/

export default function useAuthenticationInputField(initialState) {
  const [currentState, setState] = useState(initialState);

  function handleInputChange(e) {
    setState(e.target.value);
  }

  return [currentState, handleInputChange];
}
