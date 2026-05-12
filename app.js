async function fetchJobs() {
    try {
        const response = await fetch('/jobs'); // Endpoint provided by FastAPI
        const jobs = await response.json();
        
        // Update Active Workers count (jobs with status RUNNING)
        const runningJobs = jobs.filter(job => job.status === "RUNNING").length;
        document.getElementById('active-workers').innerText = runningJobs;

        renderTable(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

function renderTable(jobs) {
    const tableBody = document.getElementById('job-body');
    tableBody.innerHTML = ''; // Clear existing rows

    // Sort jobs so the most important (lowest score) are at the top
    jobs.sort((a, b) => a.priority - b.priority);

    jobs.forEach(job => {
        const row = document.createElement('tr');
        
        // Determine CSS class based on status
        let statusClass = '';
        if (job.status === 'QUEUED') statusClass = 'status-queued';
        if (job.status === 'RUNNING') statusClass = 'status-running';
        if (job.status === 'COMPLETED') statusClass = 'status-completed';

        row.innerHTML = `
            <td><code>#${job.id}</code></td>
            <td>${job.repo}</td>
            <td><span class="priority-badge">${job.priority}</span></td>
            <td><span class="status-pill ${statusClass}">${job.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Polling every 3 seconds to keep the UI "Live"
setInterval(fetchJobs, 3000);

// Initial fetch on load
fetchJobs();