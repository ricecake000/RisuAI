//@name cache-status-popup
//@display-name Cache Status Popup

// Cache Status Popup Plugin
// Shows prompt cache statistics as a brief popup in the bottom right corner
// after each model response

(function() {
    // Create and inject styles
    const style = document.createElement('style')
    style.textContent = `
        .cache-status-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(40, 40, 55, 0.95));
            border: 1px solid rgba(100, 100, 120, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            color: #e0e0e0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            min-width: 200px;
            pointer-events: none;
        }
        .cache-status-popup.visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .cache-status-popup.hiding {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
        }
        .cache-status-header {
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #888;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .cache-status-header::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4ade80;
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .cache-status-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
        }
        .cache-status-label {
            color: #aaa;
        }
        .cache-status-value {
            font-weight: 600;
            font-variant-numeric: tabular-nums;
        }
        .cache-status-value.cache-hit {
            color: #4ade80;
        }
        .cache-status-value.cache-write {
            color: #60a5fa;
        }
        .cache-status-value.neutral {
            color: #e0e0e0;
        }
        .cache-status-bar {
            margin-top: 8px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }
        .cache-status-bar-fill {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s ease;
        }
        .cache-status-bar-hit {
            background: linear-gradient(90deg, #4ade80, #22c55e);
        }
        .cache-status-summary {
            margin-top: 6px;
            font-size: 11px;
            color: #888;
            text-align: center;
        }
    `
    document.head.appendChild(style)

    // Create popup element
    const popup = document.createElement('div')
    popup.className = 'cache-status-popup'
    document.body.appendChild(popup)

    let hideTimeout = null

    function formatNumber(num) {
        if (num === undefined || num === null) return '-'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    function showPopup(stats) {
        // Clear any pending hide timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }

        const cacheRead = stats.cacheReadTokens || 0
        const cacheWrite = stats.cacheCreationTokens || 0
        const inputTokens = stats.inputTokens || 0
        const outputTokens = stats.outputTokens || 0

        // Calculate cache hit percentage
        const totalInput = inputTokens > 0 ? inputTokens : (cacheRead + cacheWrite)
        const cacheHitPercent = totalInput > 0 ? Math.round((cacheRead / totalInput) * 100) : 0

        // Determine status message
        let statusMessage = ''
        if (cacheRead > 0 && cacheWrite === 0) {
            statusMessage = 'Full cache hit!'
        } else if (cacheRead > 0 && cacheWrite > 0) {
            statusMessage = 'Partial cache hit'
        } else if (cacheWrite > 0) {
            statusMessage = 'Cache populated'
        } else {
            statusMessage = 'No cache activity'
        }

        popup.innerHTML = `
            <div class="cache-status-header">Prompt Cache</div>
            <div class="cache-status-row">
                <span class="cache-status-label">Cache Read</span>
                <span class="cache-status-value cache-hit">${formatNumber(cacheRead)} tokens</span>
            </div>
            <div class="cache-status-row">
                <span class="cache-status-label">Cache Write</span>
                <span class="cache-status-value cache-write">${formatNumber(cacheWrite)} tokens</span>
            </div>
            <div class="cache-status-row">
                <span class="cache-status-label">Input Tokens</span>
                <span class="cache-status-value neutral">${formatNumber(inputTokens)}</span>
            </div>
            <div class="cache-status-row">
                <span class="cache-status-label">Output Tokens</span>
                <span class="cache-status-value neutral">${formatNumber(outputTokens)}</span>
            </div>
            ${cacheRead > 0 || cacheWrite > 0 ? `
                <div class="cache-status-bar">
                    <div class="cache-status-bar-fill cache-status-bar-hit" style="width: ${cacheHitPercent}%"></div>
                </div>
                <div class="cache-status-summary">${statusMessage} (${cacheHitPercent}% hit rate)</div>
            ` : `
                <div class="cache-status-summary">${statusMessage}</div>
            `}
        `

        // Remove hiding class and add visible class
        popup.classList.remove('hiding')
        popup.classList.add('visible')

        // Hide after 4 seconds
        hideTimeout = setTimeout(() => {
            popup.classList.add('hiding')
            setTimeout(() => {
                popup.classList.remove('visible', 'hiding')
            }, 300)
        }, 4000)
    }

    // Subscribe to cache stats updates
    const unsubscribe = subscribeCacheStats((stats) => {
        console.log('Cache stats received:', stats)
        showPopup(stats)
    })

    // Clean up on unload
    onUnload(() => {
        if (unsubscribe) unsubscribe()
        if (hideTimeout) clearTimeout(hideTimeout)
        if (popup.parentNode) popup.parentNode.removeChild(popup)
        if (style.parentNode) style.parentNode.removeChild(style)
    })
})()
