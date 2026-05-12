const API_URL = 'http://localhost:8000/api/build-history';

async function refresh() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();
        
        if (result.status === "success") {
            updateUI(result.data);
            document.getElementById('connection-status').innerText = "🟢 System Online";
            document.getElementById('connection-status').style.color = "#4caf50";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById('connection-status').innerText = "🔴 API Offline";
        document.getElementById('connection-status').style.color = "#f44336";
    }
}
function updateUI(jobs) {
    const containers = { 'QUEUED': 'q-list', 'RUNNING': 'p-list', 'COMPLETED': 'c-list' };
    
    // This clears the old data so it can show the new updates
    Object.values(containers).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = ""; 
    });
    
    const table = document.getElementById('db-table');
    if (table) table.innerHTML = "";

    jobs.forEach(job => {
        // This injects the new row into your table
        if (table) {
            table.insertAdjacentHTML('beforeend', `
            <tr>
                <td>#${String(job.id).substring(0,6)}</td>
                <td><strong>${job.repo || repo}</strong></td>
                <td>Priority ${job.priority || 'Normal'}</td>
                <td>${job.file_size || '0'} KB</td>
                <td><code>${job.code_hash ? job.code_hash.substring(0,10) : 'N/A'}...</code></td>
                <td><span style="color:${job.status === 'COMPLETED' ? '#4caf50' : '#ff9800'}">${job.status}</span></td>
            </tr>
        `);
        }
    });
}


function getPriorityColor(p) {
    if (p <= 5) return "#f44336"; // Urgent
    if (p <= 10) return "#2196f3"; // High
    return "#444"; // Normal
}

// Update every 3 seconds for the demo
setInterval(refresh, 3000);
refresh();