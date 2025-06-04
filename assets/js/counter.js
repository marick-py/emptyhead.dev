// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyBYuNXKMAlqIiYYIqsGzKkmgpB095jO2qY",
authDomain: "emptyhead-counter.firebaseapp.com",
databaseURL: "https://emptyhead-counter-default-rtdb.europe-west1.firebasedatabase.app",
projectId: "emptyhead-counter",
storageBucket: "emptyhead-counter.firebasestorage.app",
messagingSenderId: "395254759620",
appId: "1:395254759620:web:651b5738ddd107901a4991",
measurementId: "G-PK1YVTG6NP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase(app);

function WriteData(key, value) {
    set(ref(db, key), value)
    .catch(error => console.error('Error updating JSON:', error));
}

async function ReadData(key) {
    try {
        const snapshot = await get(child(ref(db), key));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            await WriteData(key, 0);
            return 0;
        }
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

async function main() {
    let currentTotal = await ReadData("/onLoadData/totalCount");
    currentTotal += 1;
    
    const today = new Date();
    const today_str = new Date().toISOString().split('T')[0];
    let currentToday = await ReadData("/countByDay/" + today_str);
    currentToday += 1;

    await WriteData("/onLoadData/totalCount", currentTotal);
    await WriteData("/countByDay/" + today_str, currentToday);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayCount = await ReadData("/countByDay/" + yesterday.toISOString().split('T')[0]);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());  // Domenica
    const weeklyDates = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        weeklyDates.push(d.toISOString().split('T')[0]);
    }

    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based
    const monthlyDates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        monthlyDates.push(d.toISOString().split('T')[0]);
    }

    let weeklyTotal = 0;
    for (const date of weeklyDates) {
        const val = await ReadData(`/countByDay/${date}`);
        weeklyTotal += val;
    }

    let monthlyTotal = 0;
    for (const date of monthlyDates) {
        const val = await ReadData(`/countByDay/${date}`);
        monthlyTotal += val;
    }

    document.getElementById("today-count").textContent = currentToday;
    document.getElementById("yesterday-count").textContent = yesterdayCount;
    document.getElementById("week-count").textContent = weeklyTotal;
    document.getElementById("month-count").textContent = monthlyTotal;
    document.getElementById("total-count").textContent = currentTotal;

    const diff = currentToday - yesterdayCount;
    const diffElem = document.getElementById("today-diff");
    const diffValueElem = document.getElementById("today-diff-count");

    if (diff >= 0) {
        diffElem.classList.remove("down");
        diffElem.classList.add("up");
        diffValueElem.textContent = "+" + diff;
    } else {
        diffElem.classList.remove("up");
        diffElem.classList.add("down");
        diffValueElem.innerHTML = diff;
    }
    
    document.getElementById("counter-title").textContent = "Visits stats.";
}

document.addEventListener("DOMContentLoaded", main);

