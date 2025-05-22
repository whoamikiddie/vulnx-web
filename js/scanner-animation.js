// Scanner Animation System
document.addEventListener('DOMContentLoaded', function() {
    initScannerDemo();
});

let scannerInterval;
let scannerProgress = 0;
let scannerPaused = false;
let vulnerabilitiesFound = 0;

function initScannerDemo() {
    const startScanBtn = document.getElementById('start-scan');
    const pauseScanBtn = document.getElementById('pause-scan');
    const resetScanBtn = document.getElementById('reset-scan');
    const scannerScreen = document.querySelector('.scanner-screen');
    const scannerStatus = document.querySelector('.status-text');
    const statusIcon = document.querySelector('.status-icon');
    const progressBar = document.querySelector('.progress-bar');
    
    if (!startScanBtn || !pauseScanBtn || !resetScanBtn || !scannerScreen) return;
    
    // Initialize scanner display
    scannerScreen.innerHTML = '<div class="scanner-ready-text">Enter a target URL and press Start Scan</div>';
    
    // Event listeners
    startScanBtn.addEventListener('click', function() {
        if (scannerPaused) {
            // Resume scan
            scannerPaused = false;
            startScanBtn.textContent = 'Scanning...';
            startScanBtn.disabled = true;
            pauseScanBtn.disabled = false;
            pauseScanBtn.classList.remove('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
            pauseScanBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700', 'text-white');
            
            statusIcon.classList.remove('status-paused');
            statusIcon.classList.add('status-scanning');
            scannerStatus.textContent = 'Scanning in progress...';
            
            continueScan();
        } else {
            // Start new scan
            const targetInput = document.getElementById('target-input');
            if (!targetInput || !targetInput.value) {
                alert('Please enter a target URL');
                return;
            }
            
            // Reset and start
            scannerProgress = 0;
            vulnerabilitiesFound = 0;
            startScan(targetInput.value);
            
            // Update UI
            startScanBtn.textContent = 'Scanning...';
            startScanBtn.disabled = true;
            pauseScanBtn.disabled = false;
            resetScanBtn.disabled = false;
            
            pauseScanBtn.classList.remove('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
            pauseScanBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700', 'text-white');
            
            resetScanBtn.classList.remove('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
            resetScanBtn.classList.add('bg-red-600', 'hover:bg-red-700', 'text-white');
            
            statusIcon.classList.remove('status-ready', 'status-paused', 'status-complete');
            statusIcon.classList.add('status-scanning');
            scannerStatus.textContent = 'Scanning in progress...';
        }
    });
    
    pauseScanBtn.addEventListener('click', function() {
        if (!scannerPaused && scannerProgress < 100) {
            // Pause scan
            scannerPaused = true;
            clearInterval(scannerInterval);
            
            // Update UI
            startScanBtn.textContent = 'Resume';
            startScanBtn.disabled = false;
            pauseScanBtn.textContent = 'Paused';
            
            statusIcon.classList.remove('status-scanning');
            statusIcon.classList.add('status-paused');
            scannerStatus.textContent = 'Scan paused';
        }
    });
    
    resetScanBtn.addEventListener('click', function() {
        // Reset scan
        clearInterval(scannerInterval);
        scannerPaused = false;
        scannerProgress = 0;
        vulnerabilitiesFound = 0;
        
        // Reset UI
        progressBar.style.width = '0%';
        scannerScreen.innerHTML = '<div class="scanner-ready-text">Enter a target URL and press Start Scan</div>';
        
        startScanBtn.textContent = 'Start Scan';
        startScanBtn.disabled = false;
        pauseScanBtn.textContent = 'Pause';
        pauseScanBtn.disabled = true;
        resetScanBtn.disabled = true;
        
        pauseScanBtn.classList.add('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
        pauseScanBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700', 'text-white');
        
        resetScanBtn.classList.add('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
        resetScanBtn.classList.remove('bg-red-600', 'hover:bg-red-700', 'text-white');
        
        statusIcon.classList.remove('status-scanning', 'status-paused', 'status-complete');
        statusIcon.classList.add('status-ready');
        scannerStatus.textContent = 'Ready to scan';
    });
}

function startScan(target) {
    const scannerScreen = document.querySelector('.scanner-screen');
    const progressBar = document.querySelector('.progress-bar');
    
    scannerScreen.innerHTML = '';
    progressBar.style.width = '0%';
    
    // Create terminal-like display
    const terminal = document.createElement('div');
    terminal.className = 'scanner-terminal';
    scannerScreen.appendChild(terminal);
    
    // Add initial scan info
    addScanLine(terminal, `[+] Target: ${target}`, 'command');
    addScanLine(terminal, '[+] Initializing scanner modules...', 'info');
    addScanLine(terminal, '[+] Starting scan sequence...', 'info');
    
    // Start progress animation
    scannerInterval = setInterval(() => {
        if (scannerProgress >= 100) {
            completeScan(terminal);
            return;
        }
        
        scannerProgress += 1;
        progressBar.style.width = `${scannerProgress}%`;
        
        // Add scan events at certain progress points
        if (scannerProgress === 10) {
            addScanLine(terminal, '[+] Checking target availability...', 'info');
            addScanLine(terminal, '[-] Target is reachable (200 OK)', 'success');
        } else if (scannerProgress === 20) {
            addScanLine(terminal, '[+] Detecting CMS...', 'info');
            setTimeout(() => {
                if (!scannerPaused) {
                    addScanLine(terminal, '[-] CMS detected: WordPress 5.8.3', 'success');
                }
            }, 800);
        } else if (scannerProgress === 30) {
            addScanLine(terminal, '[+] Enumerating plugins...', 'info');
        } else if (scannerProgress === 40) {
            const plugins = ['Contact Form 7 (5.4.2)', 'Yoast SEO (17.5)', 'WooCommerce (5.9.0)'];
            plugins.forEach((plugin, i) => {
                setTimeout(() => {
                    if (!scannerPaused) {
                        addScanLine(terminal, `[-] Plugin found: ${plugin}`, 'success');
                    }
                }, i * 400);
            });
        } else if (scannerProgress === 50) {
            addScanLine(terminal, '[+] Checking for known vulnerabilities...', 'info');
        } else if (scannerProgress === 60) {
            // Random number of vulnerabilities (1-3)
            const vulnCount = Math.floor(Math.random() * 3) + 1;
            vulnerabilitiesFound = vulnCount;
            
            setTimeout(() => {
                if (!scannerPaused) {
                    const vulnTypes = [
                        'WooCommerce < 5.5.0: SQL Injection Vulnerability (CVE-2021-32052)',
                        'Contact Form 7 < 5.3.2: Unrestricted File Upload (CVE-2020-35489)',
                        'WordPress Core < 5.8.2: Cross-Site Scripting (CVE-2021-29447)'
                    ];
                    
                    if (vulnCount > 0) {
                        addScanLine(terminal, `[!] Found ${vulnCount} potential vulnerabilities:`, 'warning');
                        
                        for (let i = 0; i < vulnCount; i++) {
                            setTimeout(() => {
                                if (!scannerPaused) {
                                    addScanLine(terminal, `[!] ${vulnTypes[i]}`, 'vulnerability');
                                    
                                    // Flash the screen for dramatic effect
                                    terminal.classList.add('vulnerability-flash');
                                    setTimeout(() => {
                                        terminal.classList.remove('vulnerability-flash');
                                    }, 500);
                                }
                            }, i * 700);
                        }
                    } else {
                        addScanLine(terminal, '[+] No known vulnerabilities detected', 'success');
                    }
                }
            }, 1000);
        } else if (scannerProgress === 75) {
            addScanLine(terminal, '[+] Performing additional security checks...', 'info');
        } else if (scannerProgress === 85) {
            addScanLine(terminal, '[+] Generating security report...', 'info');
        } else if (scannerProgress === 95) {
            addScanLine(terminal, '[+] Finalizing scan results...', 'info');
        }
        
        // Autoscroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }, 120);
}

function continueScan() {
    const terminal = document.querySelector('.scanner-terminal');
    
    // Continue the scan
    scannerInterval = setInterval(() => {
        if (scannerProgress >= 100) {
            completeScan(terminal);
            return;
        }
        
        scannerProgress += 1;
        document.querySelector('.progress-bar').style.width = `${scannerProgress}%`;
        
        // Autoscroll to bottom
        if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    }, 120);
}

function completeScan(terminal) {
    clearInterval(scannerInterval);
    
    // Update UI
    const startScanBtn = document.getElementById('start-scan');
    const pauseScanBtn = document.getElementById('pause-scan');
    const statusIcon = document.querySelector('.status-icon');
    const scannerStatus = document.querySelector('.status-text');
    
    startScanBtn.textContent = 'Start New Scan';
    startScanBtn.disabled = false;
    pauseScanBtn.textContent = 'Pause';
    pauseScanBtn.disabled = true;
    
    pauseScanBtn.classList.add('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
    pauseScanBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700', 'text-white');
    
    statusIcon.classList.remove('status-scanning', 'status-paused');
    statusIcon.classList.add('status-complete');
    scannerStatus.textContent = 'Scan complete';
    
    // Add completion messages
    addScanLine(terminal, '[+] Scan completed successfully.', 'success');
    
    if (vulnerabilitiesFound > 0) {
        addScanLine(terminal, `[!] Security Assessment: ${vulnerabilitiesFound} vulnerabilities detected`, 'warning');
        addScanLine(terminal, '[!] Recommendation: Update affected components', 'warning');
    } else {
        addScanLine(terminal, '[+] Security Assessment: No vulnerabilities detected', 'success');
        addScanLine(terminal, '[+] Recommendation: Maintain regular updates', 'success');
    }
    
    // Timestamp
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    addScanLine(terminal, `[+] Scan finished at: ${timestamp}`, 'info');
    
    // Autoscroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

function addScanLine(terminal, text, type) {
    const line = document.createElement('div');
    line.className = `scan-line ${type}`;
    line.textContent = text;
    
    terminal.appendChild(line);
    
    // Add typewriter effect
    animateTyping(line);
}

function animateTyping(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.visibility = 'visible';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 10);
} 