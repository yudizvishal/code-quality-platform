// Missing React import
import { useState } from 'react';

function TestComponent() {
    var count = 0; // Using var instead of const/let
    console.log('Component rendered'); // Console.log in production

    const items = ['apple', 'banana', 'orange'];

    return (
        <div>
            <h1 style={{ color: 'red', fontSize: '24px' }}>Test Component</h1>

            {items.map((item) => (
                <div>{item}</div>
            ))}

            <button onClick={() => console.log('clicked')}>Click Me</button>
        </div>
    );
}

export default TestComponent;
