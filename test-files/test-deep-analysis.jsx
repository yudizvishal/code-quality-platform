// Test file for Deep Code Analysis features
// This file tests: Advanced pattern recognition, Syntax/semantic analysis, 
// Cross-file dependency tracking, Real-time error detection

import React from 'react';
import { useState } from 'react';

// Test 1: Advanced pattern recognition - Nested loops (performance issue)
function processData(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            console.log(data[i][j]);
        }
    }
}

// Test 2: Syntax issues - Using var instead of const/let
var oldStyleVariable = "This should trigger a warning";
var anotherOldVar = 100;

// Test 3: Long function (should trigger maintainability warning)
function veryLongFunction() {
    const line1 = "This is line 1";
    const line2 = "This is line 2";
    const line3 = "This is line 3";
    const line4 = "This is line 4";
    const line5 = "This is line 5";
    const line6 = "This is line 6";
    const line7 = "This is line 7";
    const line8 = "This is line 8";
    const line9 = "This is line 9";
    const line10 = "This is line 10";
    const line11 = "This is line 11";
    const line12 = "This is line 12";
    const line13 = "This is line 13";
    const line14 = "This is line 14";
    const line15 = "This is line 15";
    const line16 = "This is line 16";
    const line17 = "This is line 17";
    const line18 = "This is line 18";
    const line19 = "This is line 19";
    const line20 = "This is line 20";
    const line21 = "This is line 21";
    const line22 = "This is line 22";
    const line23 = "This is line 23";
    const line24 = "This is line 24";
    const line25 = "This is line 25";
    const line26 = "This is line 26";
    const line27 = "This is line 27";
    const line28 = "This is line 28";
    const line29 = "This is line 29";
    const line30 = "This is line 30";
    const line31 = "This is line 31";
    const line32 = "This is line 32";
    const line33 = "This is line 33";
    const line34 = "This is line 34";
    const line35 = "This is line 35";
    const line36 = "This is line 36";
    const line37 = "This is line 37";
    const line38 = "This is line 38";
    const line39 = "This is line 39";
    const line40 = "This is line 40";
    const line41 = "This is line 41";
    const line42 = "This is line 42";
    const line43 = "This is line 43";
    const line44 = "This is line 44";
    const line45 = "This is line 45";
    const line46 = "This is line 46";
    const line47 = "This is line 47";
    const line48 = "This is line 48";
    const line49 = "This is line 49";
    const line50 = "This is line 50";
    const line51 = "This is line 51";
    const line52 = "This is line 52";
    return "Function too long!";
}

// Test 4: Magic numbers
function calculatePrice(quantity) {
    return quantity * 299 + 150 - 75;
}

// Test 5: Deep nesting
function deeplyNested(value) {
    if (value > 0) {
        if (value < 100) {
            if (value % 2 === 0) {
                if (value > 50) {
                    if (value < 75) {
                        return "Too deeply nested";
                    }
                }
            }
        }
    }
}

// Test 6: Duplicate code
const duplicateLine = "This exact line appears multiple times";
const duplicateLine2 = "This exact line appears multiple times";
const duplicateLine3 = "This exact line appears multiple times";
const duplicateLine4 = "This exact line appears multiple times";
const duplicateLine5 = "This exact line appears multiple times";
const duplicateLine6 = "This exact line appears multiple times";

// Test 7: Missing key in map
function UserList({ users }) {
    return (
        <div>
            {users.map((user) => (
                <div>{user.name}</div>
            ))}
        </div>
    );
}

// Test 8: Inline styles (performance issue)
function StyledComponent() {
    return <div style={{ color: 'red', fontSize: '16px' }}>Styled</div>;
}

// Test 9: Commented out code
// function oldFunction() {
//     const oldVar = "This is commented";
//     return oldVar;
// }
// const anotherCommented = "test";

// Test 10: TODO comments
// TODO: Implement this feature
// FIXME: This needs to be fixed

export default UserList;
