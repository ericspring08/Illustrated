import React from "react"

const Modal: React.FC<any> = (props) => {
    return (
        <>
            <input type="checkbox" id={props.id} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative flex flex-col">
                    <label htmlFor={props.id} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">{props.title}</h3>
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default Modal