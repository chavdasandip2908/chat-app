import React from 'react'
// import { Input, initMDB } from "mdb-ui-kit";



export default function Input(Parms) {
    return (
        <div className='row'>
            <div className="form-outline col-12 col-sm-5" >
                <label className="form-label" htmlFor={Parms.id}>{Parms.label}</label>
                <input type={Parms.type} id={Parms.id} className="form-control" placeholder={Parms.placeholder}/>
            </div>
        </div>
    )
}
