function DemoComponent() {
    // Intentionally left empty to demonstrate code quality issues

    console.log('Testing'); // Issue: console.log in code

    // TODO: Add proper state management

    const items = ['apple', 'banana', 'orange'];

    return (
        <div style={{ padding: '20px' }}> {/* Warning: Inline styles */}
            <h1>Demo Component</h1>

            <ul>
                {items.map(item => ( /* Issue: Missing key prop */
                    <li>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default DemoComponent;
