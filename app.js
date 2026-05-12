const API_URL = 'http://localhost:8000/api/build-history';

async function refresh() {
    try {
        const res = await fetch(API_URL);
        const result = await res.json();
        if (result.status === "success") {
            updateUI(result.data);
            document.getElementById('connection-status').innerText = "🟢 System Online";
        }
    } catch (e) {
        document.getElementById('connection-status').innerText = "🔴 API Offline";
    }
}

function updateUI(jobs) {
    const containers = { 'QUEUED': 'q-list', 'RUNNING': 'p-list', 'COMPLETED': 'c-list' };
    Object.values(containers).forEach(id => { 
        const el = document.getElementById(id);
        if (el) el.innerHTML = ""; 
    });

    const tableBody = document.getElementById('db-table');
    if (!tableBody) return;
    tableBody.innerHTML = "";

    jobs.forEach(job => {
        // Table row
        tableBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>#${job.id}</td>
                <td><strong>${job.repo}</strong></td>
                <td>Normal</td>
                <td>0 KB</td>
                <td><code>---</code></td>
                <td>${job.status}</td>
            </tr>
        `);

        // Kanban Card
        const containerId = containers[job.status];
        if (containerId) {
            document.getElementById(containerId).insertAdjacentHTML('beforeend', `
                <div class="job-card"><span class="repo-name">${job.repo}</span><small>ID: ${job.id}</small></div>
            `);
        }
    });
}
setInterval(refresh, 3000);
refresh();