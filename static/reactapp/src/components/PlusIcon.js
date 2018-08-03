import React from 'react';

export default props => (
    <svg
        height={props.height || 24}
        className="octicon octicon-plus"
        viewBox="0 0 12 16"
        version="1.1"
        width={props.width || 24}
        aria-hidden="true">
        <path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5z" />
    </svg>
);
