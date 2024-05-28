import React from 'react';
import './ScrollButton.scss';

const ScrollButton = () => {
    const scrollToTop = () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        console.log('click');
    };

    return (
        <button className="scroll" onClick={scrollToTop} title="Back to top">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 8 8"
                preserveAspectRatio="none"
                fill="#fff"
            >
                <path d="M5.044 1.062 1.308 4.798.27 3.76 4.007.026z"></path>
                <path d="M3.161 1.604h1.683v6.375H3.161z"></path>
                <path d="m4 .02 3.737 3.736-1.035 1.036-3.737-3.735z"></path>
            </svg>
        </button>
    );
};

export default ScrollButton;
