// Test file for Deep Code Analysis
// This file contains various patterns and anti-patterns for testing

// Anti-Pattern: Using var instead of const/let
var oldVariable = "I should be const or let";

// Anti-Pattern: console.log in production
console.log("Debug message");

// Security Issue: eval usage
function dangerousFunction(userInput) {
    eval(userInput); // CRITICAL SECURITY ISSUE
}

// Anti-Pattern: Callback Hell
function callbackHell() {
    setTimeout(() => {
        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    console.log("Too deep!");
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}

// Design Pattern: Module Pattern (Good!)
export const myModule = {
    privateVar: "private",
    publicMethod: function () {
        return this.privateVar;
    }
};

// Anti-Pattern: Magic Numbers
function calculateTotal(price) {
    return price * 1.18 + 50 + 25; // What do these numbers mean?
}

// Performance Issue: Nested loops
function inefficientSearch(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                console.log("Found match");
            }
        }
    }
}

// Anti-Pattern: God Object (too many methods)
class GodObject {
    method1() { }
    method2() { }
    method3() { }
    method4() { }
    method5() { }
    method6() { }
    method7() { }
    method8() { }
    method9() { }
    method10() { }
    method11() { }
    method12() { }
    method13() { }
    method14() { }
    method15() { }
    method16() { }
    method17() { }
    method18() { }
    method19() { }
    method20() { }
}

// Security Issue: Hardcoded credentials
const API_KEY = "sk-1234567890abcdef"; // NEVER DO THIS!
const password = "admin123"; // CRITICAL!

// Runtime Error: Potential undefined access
function unsafeAccess(obj) {
    return obj.user.profile.name; // What if obj.user is undefined?
}

// Good Pattern: Factory Pattern
function createUser(name, email) {
    return {
        name,
        email,
        createdAt: new Date()
    };
}

// Anti-Pattern: Copy-Paste Programming
function processUser1(user) {
    const name = user.name;
    const email = user.email;
    console.log(name, email);
    return { name, email };
}

function processUser2(user) {
    const name = user.name;
    const email = user.email;
    console.log(name, email);
    return { name, email };
}

function processUser3(user) {
    const name = user.name;
    const email = user.email;
    console.log(name, email);
    return { name, email };
}

// Performance Issue: Inefficient array operation
function inefficientMap(arr) {
    const result = [];
    arr.forEach(item => {
        result.push(item * 2);
    });
    return result; // Should use .map() instead
}

// Semantic Error: Comparing with ==
function badComparison(value) {
    if (value == null) { // Should use ===
        return true;
    }
    return false;
}

// Good Pattern: Observer Pattern (React-style)
function useEffect(callback, dependencies) {
    // Simulated React hook
    callback();
}
