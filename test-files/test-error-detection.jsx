// Test file for Error Detection features
// Tests: Missing imports, Undefined variables, Type mismatches, Security vulnerabilities

// Test 1: Missing React import (should be detected)
function ComponentWithoutImport() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Count: {count}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

// Test 2: Undefined variable usage
function useUndefinedVariable() {
    console.log(undefinedVar);
    return someOtherUndefined + 10;
}

// Test 3: console.log statements (should be removed in production)
function debugFunction() {
    console.log("Debug message 1");
    const data = fetchData();
    console.log("Data:", data);
    console.warn("Warning message");
    console.error("Error message");
    return data;
}

// Test 4: Using var (should use const/let)
var globalVar = "Should be const or let";
var counter = 0;
var userName = "John";

// Test 5: Security - eval usage (dangerous)
function unsafeCode(userInput) {
    eval(userInput);
}

// Test 6: Missing key prop in lists
function ItemList({ items }) {
    return (
        <ul>
            {items.map((item) => (
                <li>{item.name}</li>
            ))}
        </ul>
    );
}

// Test 7: Type mismatch patterns
function typeMismatch() {
    const number = "123";
    const result = number + 10;
    return result;
}

export default ComponentWithoutImport;
