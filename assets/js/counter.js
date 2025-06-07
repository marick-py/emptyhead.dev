import { getApp, getApps } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
// import { onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const app = getApps().length > 0 ? getApp() : null;

if (!app) {
  throw new Error("Firebase app non inizializzata! login.js deve essere caricato prima di counter.js.");
}
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
    startOfWeek.setDate(today.getDate() - today.getDay());
    const weeklyDates = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        weeklyDates.push(d.toISOString().split('T')[0]);
    }

    const year = today.getFullYear();
    const month = today.getMonth();
    const monthlyDates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        monthlyDates.push(d.toISOString().split('T')[0]);
    }

    const allData = await ReadData('/countByDay'); // { "2025-06-01": 123, ... }

    let weeklyTotal = 0;
    for (const date of weeklyDates) {
        weeklyTotal += allData[date] || 0;
    }

    let monthlyTotal = 0;
    for (const date of monthlyDates) {
        monthlyTotal += allData[date] || 0;
    }

    document.getElementById("today-count").textContent = currentToday;
    document.getElementById("yesterday-count").textContent = yesterdayCount;
    document.getElementById("week-count").textContent = weeklyTotal;
    document.getElementById("month-count").textContent = monthlyTotal;
    document.getElementById("total-count").textContent = currentTotal;

    const diff = currentToday - yesterdayCount;
    const diffElem = document.getElementById("today-diff");
    const diffCount = document.getElementById("today-diff-count");
    const diffArrow = document.getElementById("today-diff-arrow");

    if (diff > 0) {
        diffElem.classList.remove("down");
        diffElem.classList.add("up");
        diffCount.textContent = `(+${diff})`;
        diffArrow.className = "fas fa-arrow-up";
    } else if (diff < 0) {
        diffElem.classList.remove("up");
        diffElem.classList.add("down");
        diffCount.textContent = `(${diff})`;
        diffArrow.className = "fas fa-arrow-down";
    } else {
        diffElem.classList.remove("up", "down");
        diffCount.textContent = "(0)";
        diffArrow.style.display = "none";
    }
    
    document.getElementById("counter-title").textContent = "Visits stats.";
}

document.addEventListener("DOMContentLoaded", main);

// const totalCounterRef = ref(db, "/onLoadData/totalCount");
// onValue(totalCounterRef, (snapshot) => {
//     main();
// });