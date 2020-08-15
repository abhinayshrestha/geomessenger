import React from 'react'
import './mainLoader.css'

function MainLoader() {
    return (
        <div>
            <div id="loader-wrapper">
            <div id="loader"></div>
            
            <div className="loader-section section-left"></div>
            <div className="loader-section section-right"></div>
            
            </div>
        </div>
    )
}

export default MainLoader
