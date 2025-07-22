import React from 'react';

const Client = ({username}) => {
    // Generate initials from username
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate a consistent color based on username
    const getAvatarColor = (name) => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
            '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
        ];
        const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    return (
        <div className='client'>
            <div 
                className='avatar'
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    backgroundColor: getAvatarColor(username),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
            >
                {getInitials(username)}
            </div>
            <span className='userName'>
                {username}
            </span>
        </div>
    )
}

export default Client