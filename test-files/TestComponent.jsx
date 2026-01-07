import React from 'react';

// This is a sample file with intentional issues for testing

function TestComponent() {
    var count = 0; // Using var instead of const/let

    console.log('This should not be in production'); // Console.log found

    // TODO: Implement proper state management

    const items = ['apple', 'banana', 'orange'];

    return (
        <div style={{ padding: '20px', color: 'blue' }}>
            <h1>Test Component</h1>

            {/* Missing key prop in list */}
            <ul>
                {items.map(item => (
                    <li>{item}</li>
                ))}
            </ul>

            <div>
                Count: {count}
            </div>
        </div>
    );
}

export default TestComponent;
