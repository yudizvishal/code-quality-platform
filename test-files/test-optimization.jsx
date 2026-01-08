// Test file for Code Optimization features
// Tests: Performance bottlenecks, Code complexity, Best practices, Refactoring recommendations

import React from 'react';

// Test 1: Performance bottleneck - Nested loops
function findDuplicates(arr1, arr2) {
    const duplicates = [];
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            if (arr1[i] === arr2[j]) {
                duplicates.push(arr1[i]);
            }
        }
    }
    return duplicates;
}

// Test 2: High code complexity - Multiple if/else chains
function complexLogic(status, type, level, priority) {
    if (status === 'active') {
        if (type === 'urgent') {
            if (level > 5) {
                if (priority === 'high') {
                    return 'critical';
                } else {
                    return 'important';
                }
            } else {
                return 'normal';
            }
        } else {
            return 'low';
        }
    } else {
        if (type === 'urgent') {
            return 'pending';
        } else {
            return 'inactive';
        }
    }
}

// Test 3: Long parameter list (should suggest object destructuring)
function createUser(firstName, lastName, email, phone, address, city, state, zipCode, country, dateOfBirth, gender) {
    return {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        dateOfBirth,
        gender
    };
}

// Test 4: Inline styles (should move to CSS)
function InlineStyledComponent() {
    return (
        <div style={{ backgroundColor: 'blue', padding: '20px', margin: '10px' }}>
            <h1 style={{ color: 'white', fontSize: '24px' }}>Title</h1>
            <p style={{ color: 'lightgray', lineHeight: '1.5' }}>Content</p>
        </div>
    );
}

// Test 5: Class component (should suggest hooks)
class OldComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    increment = () => {
        this.setState({ count: this.state.count + 1 });
    }

    render() {
        return (
            <div>
                <p>Count: {this.state.count}</p>
                <button onClick={this.increment}>Increment</button>
            </div>
        );
    }
}

// Test 6: Magic numbers (should extract to constants)
function calculateDiscount(price) {
    if (price > 1000) {
        return price * 0.15;
    } else if (price > 500) {
        return price * 0.10;
    } else if (price > 250) {
        return price * 0.05;
    }
    return 0;
}

// Test 7: Duplicate code blocks
function processUserData(user) {
    const fullName = user.firstName + ' ' + user.lastName;
    const email = user.email.toLowerCase();
    const phone = user.phone.replace(/\D/g, '');
    return { fullName, email, phone };
}

function processAdminData(admin) {
    const fullName = admin.firstName + ' ' + admin.lastName;
    const email = admin.email.toLowerCase();
    const phone = admin.phone.replace(/\D/g, '');
    return { fullName, email, phone };
}

// Test 8: Excessive complexity indicators
function validateForm(data) {
    if (data.name) {
        if (data.email) {
            if (data.phone) {
                if (data.address) {
                    if (data.city) {
                        if (data.state) {
                            for (let i = 0; i < data.items.length; i++) {
                                if (data.items[i].quantity > 0) {
                                    while (data.items[i].processing) {
                                        switch (data.items[i].status) {
                                            case 'pending':
                                                break;
                                            case 'approved':
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

// Test 9: Unused imports (if we had imports)
// import { unusedFunction } from './utils';

// Test 10: Large file indicator (this file has many lines)
const line1 = "padding";
const line2 = "padding";
const line3 = "padding";
const line4 = "padding";
const line5 = "padding";

export { OldComponent, InlineStyledComponent };
