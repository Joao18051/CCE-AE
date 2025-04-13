import React, { useState } from 'react'
import './LoginSingup.css'

import emailIcon from '../Assets/email.svg'
import passwordIcon from '../Assets/password.svg'
import personIcon from '../Assets/person.svg'

export default function LoginSingup() {
  const [action, setAction] = useState("Inscreva-se");
  return (
    <div className="container">
      <div className="header">
        <div className="text">
            {action}
        </div>
        <div className="underline"></div>
        <div className="inputs">
            {action==="Entrar"?<div></div>:
              <div className="input">
                  <img src={personIcon} alt="" />
                  <input type="text" placeholder='Nome'/>
              </div>}

            <div className="input">
                <img src={emailIcon} alt="" />
                <input type="email" placeholder='nome@mail.com'/>
            </div>

            <div className="input">
                <img src={passwordIcon} alt="" />
                <input type="password" placeholder='Senha'/>
            </div>
        </div>
      </div>
      {action==="Inscreva-se"?<div></div>:
        <div className="forgotPassword">
          Esqueçeu sua senha? <span>Clique Aqui!</span>
        </div>}
      
      <div className="submitContainer">
        <div className={action==="Entrar"?"submit gray":"submit"} onClick={()=>{setAction("Inscreva-se")}}>
          Inscreva-se
        </div>

        <div className={action==="Inscreva-se"?"submit gray":"submit"} onClick={()=>{setAction("Entrar")}}>
          Entrar
        </div>
      </div>
    </div>
  )
}
