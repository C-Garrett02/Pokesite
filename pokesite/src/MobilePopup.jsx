import { useState, Fragment } from 'react'
import './MobilePopup.css'

function MobilePopup() {
   const [open, setOpen] = useState(window.innerHeight > window.innerWidth);

   return (
    <Fragment>
        <div className={"blurBehind " + (open ? "" : "closed")} />
        <div className={"popup " + (open ? "" : "closed")}>
            <span className="popupText">This website is not supported on vertical devices at this time. <br /> <br /> Please check back another time!</span>
            <button className='popupCloseButton' onClick={() => setOpen(false)}>
                Okay
            </button>
        </div>
    </Fragment>
   )
}

export default MobilePopup;