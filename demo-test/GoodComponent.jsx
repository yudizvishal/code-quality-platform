import { useState } from 'react';

const GoodComponent = () => {
    const [count, setCount] = useState(0);
    const [items] = useState(['Item 1', 'Item 2', 'Item 3']);

    const handleIncrement = () => {
        setCount(prev => prev + 1);
    };

    return (
        <div className="container">
            <h2>Perfect Quality Component</h2>

            <button onClick={handleIncrement}>
                Count: {count}
            </button>

            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default GoodComponent;
