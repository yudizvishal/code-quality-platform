import { useState } from 'react';

// Good quality file with minimal issues

const GoodComponent = () => {
    const [count, setCount] = useState(0);
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

    const handleIncrement = () => {
        setCount(prevCount => prevCount + 1);
    };

    const handleDecrement = () => {
        setCount(prevCount => prevCount - 1);
    };

    const handleAddItem = () => {
        setItems(prevItems => [...prevItems, `Item ${prevItems.length + 1}`]);
    };

    return (
        <div className="good-component">
            <h2>Good Quality Component</h2>

            <div className="counter">
                <button onClick={handleDecrement}>-</button>
                <span>{count}</span>
                <button onClick={handleIncrement}>+</button>
            </div>

            <ul className="items-list">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

            <button onClick={handleAddItem}>Add Item</button>
        </div>
    );
};

export default GoodComponent;
