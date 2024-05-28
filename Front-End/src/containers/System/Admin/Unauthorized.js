import React from 'react';

const Unauthorized = () => {
    return (
        <div className="unauthorized-container" style={{ textAlign: 'center', position: 'relative' }}>
            <h1
                className="unauthorized-title"
                style={{
                    position: 'absolute',
                    top: '-5%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '1',
                }}
            >
                <span>
                    <span style={{ animation: 'fadeIn 1s ease-in-out', display: 'inline-block' }}>
                        You do not have permission to access this page.
                    </span>
                </span>
            </h1>
            <img
                src="https://gifdb.com/images/high/no-meme-headshake-spies-in-disguise-gbl9w82r4jsd5zd1.gif"
                alt="Unauthorized"
                style={{
                    display: 'block',
                    margin: 'auto',
                    maxWidth: '100%',
                    position: 'relative',
                    zIndex: '0',
                    marginTop: '50px',
                }}
            />
        </div>
    );
};

export default Unauthorized;
