// Application State
const appState = {
    currentScreen: 'landing',
    selectedModality: null,
    parameters: {
        electrodes: 32,
        noise: 5,
        training: 10
    },
    metrics: {
        accuracy: 0,
        latency: 0,
        invasiveness: 1,
        cost: 0
    }
};

// Modality Data
const modalityData = {
    eeg: {
        name: 'EEG',
        fullName: 'Electroencephalography',
        tagline: 'The Safe Standard',
        emoji: '🧠',
        baseAccuracy: 65,
        baseLatency: 80,
        baseCost: 500,
        invasiveness: 1,
        electrodeRange: { min: 8, max: 256, default: 32, step: 8 },
        color: 'blue',
        description: 'EEG is the most common BCI method. It\'s completely non-invasive (no surgery needed!) and relatively affordable. Electrodes placed on your scalp detect electrical activity from synchronized firing of thousands of neurons. While it can\'t pinpoint exact brain regions as precisely as invasive methods, it\'s perfect for applications where safety and cost matter most, like consumer products and research studies. The main challenge is signal noise from muscle movements, eye blinks, and environmental interference.'
    },
    emg: {
        name: 'EMG',
        fullName: 'Electromyography',
        tagline: 'Muscle-Powered Control',
        emoji: '💪',
        baseAccuracy: 75,
        baseLatency: 40,
        baseCost: 1500,
        invasiveness: 1,
        electrodeRange: { min: 4, max: 32, default: 8, step: 4 },
        color: 'orange',
        description: 'EMG doesn\'t actually read your brain. It detects electrical signals from your muscles when they contract. This makes it easier to get strong and reliable signals, which is why it\'s popular for controlling prosthetic limbs and assistive devices. However, it requires the user to have at least some muscle control, so it won\'t work for people with complete paralysis. EMG is technically not a true "brain-computer" interface, but it\'s often used alongside BCIs or as an alternative for movement-based control.'
    },
    ecog: {
        name: 'ECoG',
        fullName: 'Electrocorticography',
        tagline: 'High Performance, Higher Risk',
        emoji: '⚡',
        baseAccuracy: 85,
        baseLatency: 20,
        baseCost: 10000,
        surgeryCost: 50000,
        invasiveness: 3,
        electrodeRange: { min: 32, max: 128, default: 64, step: 8 },
        color: 'purple',
        description: 'ECoG provides much better signal quality than EEG because the electrodes sit directly on the brain\'s surface beneath your skull. This requires surgery (craniotomy) to place an electrode grid on top of the dura mater (brain covering). The signals are much stronger and clearer since they don\'t have to pass through the skull and scalp. ECoG is mainly used clinically for epilepsy patients; doctors use it to map seizures before surgery. For BCIs, it\'s a middle ground, offering better performance than EEG but less risky than penetrating electrodes. However, surgical risks include infection, brain injury, and immune response to the implant.'
    },
    fnirs: {
        name: 'fNIRS',
        fullName: 'Functional Near-Infrared Spectroscopy',
        tagline: 'The Portable Option',
        emoji: '💡',
        baseAccuracy: 60,
        baseLatency: 1500,
        baseCost: 8000,
        invasiveness: 1,
        electrodeRange: { min: 8, max: 64, default: 16, step: 8 },
        color: 'green',
        description: 'Instead of measuring electrical activity, fNIRS detects changes in blood oxygen levels in your brain. It works by shining near-infrared light through your skull and measuring how much is reflected back. Active brain regions use more oxygen, so blood flow increases, which changes the light absorption. fNIRS is much slower than EEG (takes 1-2 seconds to detect brain activity changes versus milliseconds for EEG), but it\'s far less affected by movement, making it ideal for real-world applications like augmented reality, sports monitoring, or brain-controlled mobile devices. It\'s also more portable than traditional brain imaging.'
    }
};

// Educational Tips
const educationalTips = [
    "Did you know? BCIs have helped paralyzed patients control robotic arms with just their thoughts.",
    "The first BCI was developed in the 1970s at UCLA.",
    "Modern BCIs can decode brain signals at rates over 90% accuracy.",
    "Non-invasive BCIs like EEG are completely safe and painless.",
    "Your brain generates about 12-25 watts of electricity, which is enough to power a low-wattage LED bulb.",
    "The human brain has approximately 86 billion neurons, each capable of connecting to thousands of others."
];

// Tooltip Content
const tooltipContent = {
    electrodes: "More electrodes provide better spatial resolution and signal quality, but increase cost and complexity. Typical EEG systems range from 8 electrodes (simple) to 256 (research-grade).",
    noise: "Noise comes from muscle movements, eye blinks, and environmental interference. Lower noise = better accuracy. In real BCIs, noise is reduced through signal processing and better electrode placement.",
    training: "BCIs improve with training. The system learns your unique brain patterns, and you learn to control your brain signals better. More training generally means higher accuracy, especially for complex tasks.",
    accuracy: "Percentage of correct interpretations. Medical applications need >90%, gaming can work with 70-80%.",
    latency: "Time between thought and device response. Lower is better. Invasive methods are faster. For reference: human reaction time is ~200-300ms.",
    invasiveness: "Risk level from surgical procedures. 1 = completely safe, 5 = brain surgery required.",
    cost: "Includes hardware, surgery (if applicable), and setup. Doesn't include ongoing maintenance or training costs."
};

// Calculation Functions
function calculateAccuracy(modality, electrodes, noise, training) {
    const data = modalityData[modality];
    let baseAccuracy = data.baseAccuracy;
    
    const electrodeBonus = Math.log(electrodes) * 5;
    const noisePenalty = noise * 2;
    const trainingBonus = Math.log(training + 1) * 3;
    
    let accuracy = baseAccuracy + electrodeBonus - noisePenalty + trainingBonus;
    accuracy = Math.max(60, Math.min(98, accuracy));
    
    return Math.round(accuracy);
}

function calculateLatency(modality, electrodes, noise) {
    const data = modalityData[modality];
    let baseLatency = data.baseLatency;
    
    const electrodePenalty = electrodes * 0.1;
    const noisePenalty = noise * 2;
    
    let latency = baseLatency + electrodePenalty + noisePenalty;
    return Math.round(latency);
}

function calculateCost(modality, electrodes, noise) {
    const data = modalityData[modality];
    let baseCost = data.baseCost;
    let surgeryCost = data.surgeryCost || 0;
    
    const electrodeCost = electrodes * 50;
    const noiseMultiplier = 1 + ((10 - noise) * 0.05);
    
    let totalCost = (baseCost + electrodeCost) * noiseMultiplier + surgeryCost;
    return Math.round(totalCost);
}

function costToDollars(cost) {
    if (cost < 1000) return '$';
    if (cost < 5000) return '$$';
    if (cost < 20000) return '$$$';
    if (cost < 50000) return '$$$$';
    return '$$$$$';
}

function updateMetrics() {
    const { selectedModality, parameters } = appState;
    if (!selectedModality) return;
    
    const accuracy = calculateAccuracy(selectedModality, parameters.electrodes, parameters.noise, parameters.training);
    const latency = calculateLatency(selectedModality, parameters.electrodes, parameters.noise);
    const cost = calculateCost(selectedModality, parameters.electrodes, parameters.noise);
    const invasiveness = modalityData[selectedModality].invasiveness;
    
    appState.metrics = { accuracy, latency, cost, invasiveness };
    
    // Update UI
    const accuracyDisplay = document.getElementById('accuracy-display');
    const latencyDisplay = document.getElementById('latency-display');
    const costDisplay = document.getElementById('cost-display');
    const costDollars = document.getElementById('cost-dollars');
    const invasivenessDisplay = document.getElementById('invasiveness-display');
    const accuracyBar = document.getElementById('accuracy-bar');
    
    if (accuracyDisplay) {
        accuracyDisplay.textContent = `${accuracy}%`;
        accuracyBar.style.width = `${accuracy}%`;
        
        // Colour coding
        if (accuracy < 70) {
            accuracyBar.className = 'bg-red-600 h-3 rounded-full transition-all duration-500';
        } else if (accuracy < 85) {
            accuracyBar.className = 'bg-yellow-600 h-3 rounded-full transition-all duration-500';
        } else {
            accuracyBar.className = 'bg-green-600 h-3 rounded-full transition-all duration-500';
        }
    }
    
    if (latencyDisplay) latencyDisplay.textContent = `${latency} ms`;
    if (costDisplay) costDisplay.textContent = `$${cost.toLocaleString()}`;
    if (costDollars) costDollars.textContent = costToDollars(cost);
    if (invasivenessDisplay) invasivenessDisplay.textContent = `${invasiveness}/5`;
    
    // Update invasiveness dots
    const dots = document.querySelectorAll('.invasiveness-dot');
    dots.forEach((dot, index) => {
        if (index < invasiveness) {
            dot.className = 'invasiveness-dot w-6 h-6 rounded-full bg-orange-600';
        } else {
            dot.className = 'invasiveness-dot w-6 h-6 rounded-full bg-gray-300';
        }
    });
}

// Screen Navigation
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.style.display = 'block';
    }
    
    appState.currentScreen = screenId.replace('-screen', '');
    window.scrollTo(0, 0);
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Start Button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => showScreen('modality-screen'));
    }
    
    // App Title Navigation
    ['app-title', 'app-title-2', 'app-title-3'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', () => showScreen('landing-screen'));
        }
    });
    
    // Reset Buttons
    ['reset-btn', 'reset-btn-2'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to start over? Your current configuration will be lost.')) {
                    appState.selectedModality = null;
                    appState.parameters = { electrodes: 32, noise: 5, training: 10 };
                    showScreen('landing-screen');
                }
            });
        }
    });
    
    // Help Buttons
    ['help-btn', 'help-btn-2'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                document.getElementById('help-modal').classList.remove('hidden');
            });
        }
    });
    
    const closeHelp = document.getElementById('close-help');
    if (closeHelp) {
        closeHelp.addEventListener('click', () => {
            document.getElementById('help-modal').classList.add('hidden');
        });
    }
    
    // Modality Selection
    document.querySelectorAll('.modality-card .select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.modality-card');
            const modality = card.dataset.modality;
            selectModality(modality);
        });
    });
    
    // Info Buttons for Modalities
    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modality = btn.dataset.modality;
            if (modality) {
                showModalityInfo(modality);
            }
        });
    });
    
    // Tooltip Info Buttons
    document.querySelectorAll('.info-tooltip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tip = btn.dataset.tip;
            if (tip && tooltipContent[tip]) {
                showTooltip(tooltipContent[tip]);
            }
        });
    });
    
    // Close Modal
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('info-modal').classList.add('hidden');
        });
    }
    
    // Change Method Button
    const changeMethodBtn = document.getElementById('change-method-btn');
    if (changeMethodBtn) {
        changeMethodBtn.addEventListener('click', () => {
            showScreen('modality-screen');
        });
    }
    
    // Parameter Sliders
    const electrodeSlider = document.getElementById('electrode-slider');
    const noiseSlider = document.getElementById('noise-slider');
    const trainingSlider = document.getElementById('training-slider');
    
    if (electrodeSlider) {
        electrodeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            appState.parameters.electrodes = value;
            document.getElementById('electrode-value').textContent = `${value} electrodes`;
            updateMetrics();
        });
    }
    
    if (noiseSlider) {
        noiseSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            appState.parameters.noise = value;
            let label = 'Medium';
            if (value <= 3) label = 'Low';
            else if (value >= 7) label = 'High';
            document.getElementById('noise-value').textContent = `${label} (${value.toFixed(1)})`;
            updateMetrics();
        });
    }
    
    if (trainingSlider) {
        trainingSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            appState.parameters.training = value;
            document.getElementById('training-value').textContent = `${value} hours`;
            updateMetrics();
        });
    }
    
    // View Results Button
    const viewResultsBtn = document.getElementById('view-results-btn');
    if (viewResultsBtn) {
        viewResultsBtn.addEventListener('click', () => {
            generateResults();
            showScreen('results-screen');
        });
    }
    
    // Star Configuration Button
    const starConfigBtn = document.getElementById('star-config-btn');
    if (starConfigBtn) {
        starConfigBtn.addEventListener('click', () => {
            starConfiguration();
        });
    }
    
    // Results Navigation
    const tryDifferentBtn = document.getElementById('try-different-btn');
    if (tryDifferentBtn) {
        tryDifferentBtn.addEventListener('click', () => {
            showScreen('parameters-screen');
        });
    }
    
    const chooseDifferentBtn = document.getElementById('choose-different-btn');
    if (chooseDifferentBtn) {
        chooseDifferentBtn.addEventListener('click', () => {
            showScreen('modality-screen');
        });
    }
    
    const starResultsBtn = document.getElementById('star-results-btn');
    if (starResultsBtn) {
        starResultsBtn.addEventListener('click', () => {
            starConfiguration();
        });
    }
    
    // Rotating Educational Tips
    rotateEducationalTip();
    setInterval(rotateEducationalTip, 10000);
});

function selectModality(modality) {
    appState.selectedModality = modality;
    const data = modalityData[modality];
    
    // Update slider ranges
    const electrodeSlider = document.getElementById('electrode-slider');
    if (electrodeSlider) {
        electrodeSlider.min = data.electrodeRange.min;
        electrodeSlider.max = data.electrodeRange.max;
        electrodeSlider.value = data.electrodeRange.default;
        electrodeSlider.step = data.electrodeRange.step;
        appState.parameters.electrodes = data.electrodeRange.default;
        document.getElementById('electrode-value').textContent = `${data.electrodeRange.default} electrodes`;
    }
    
    // Update selected method display
    const display = document.getElementById('selected-method-display');
    if (display) {
        display.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-3">${data.emoji}</div>
                <h4 class="text-2xl font-bold text-white mb-1">${data.name}</h4>
                <p class="text-sm text-gray-400 italic mb-2">${data.fullName}</p>
                <span class="inline-block bg-${data.color}-100 text-${data.color}-700 text-xs font-bold px-3 py-1 rounded-full">
                    ${data.tagline}
                </span>
            </div>
        `;
    }
    
    updateMetrics();
    showScreen('parameters-screen');
}

function showModalityInfo(modality) {
    const data = modalityData[modality];
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = `${data.name} - ${data.fullName}`;
    content.textContent = data.description;
    
    modal.classList.remove('hidden');
}

function showTooltip(text) {
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = 'Information';
    content.textContent = text;
    
    modal.classList.remove('hidden');
}

function rotateEducationalTip() {
    const tipElement = document.getElementById('educational-tip');
    if (tipElement) {
        const randomTip = educationalTips[Math.floor(Math.random() * educationalTips.length)];
        tipElement.textContent = randomTip;
    }
}

function generateResults() {
    const resultsContent = document.getElementById('results-content');
    const { selectedModality, parameters, metrics } = appState;
    const data = modalityData[selectedModality];
    
    const useCases = getUseCases(metrics.accuracy, selectedModality);
    const improvements = getImprovements(selectedModality, parameters, metrics);
    
    resultsContent.innerHTML = `
        <div class="glass-card-strong rounded-2xl shadow-xl p-8 mb-8 border border-white/10">
            <h2 class="text-3xl font-bold text-white gradient-text mb-6">Your BCI Configuration</h2>
            <div class="flex items-center mb-6">
                <div class="text-7xl mr-6">${data.emoji}</div>
                <div>
                    <h3 class="text-4xl font-bold text-white${data.color}-600">${data.name}</h3>
                    <p class="text-xl text-gray-400">${data.fullName}</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="glass-card-strong rounded-2xl shadow-xl p-4 border border-white/10">
                    <p class="text-sm text-gray-400 mb-1">Electrodes</p>
                    <p class="text-3xl font-bold text-gray-400">${parameters.electrodes}</p>
                </div>
                <div class="glass-card-strong rounded-2xl shadow-xl p-4 border border-white/10">
                    <p class="text-sm text-gray-400 mb-1">Noise Level</p>
                    <p class="text-3xl font-bold text-gray-400">${parameters.noise.toFixed(1)}</p>
                </div>
                <div class="glass-card-strong rounded-2xl shadow-xl p-4 border border-white/10">
                    <p class="text-sm text-gray-400 mb-1">Training Time</p>
                    <p class="text-3xl font-bold text-gray-400">${parameters.training}h</p>
                </div>
            </div>
        </div>
        
        <div class="glass-card-strong rounded-2xl shadow-xl p-8 mb-8 border border-white/10">
            <h2 class="text-3xl font-bold gradient-text mb-6">Performance Analysis</h2>
            <div class="grid md:grid-cols-2 gap-6">
                ${generateMetricCard('Accuracy', metrics.accuracy, 'accuracy')}
                ${generateMetricCard('Latency', metrics.latency, 'latency')}
                ${generateMetricCard('Invasiveness', metrics.invasiveness, 'invasiveness')}
                ${generateMetricCard('Cost', metrics.cost, 'cost')}
            </div>
        </div>
        
        <div class="glass-card-strong rounded-2xl shadow-xl p-8 mb-8 border border-white/10">
            <h2 class="text-3xl font-bold gradient-text mb-6">Use Case Recommendations</h2>
            ${useCases}
        </div>
        
        <div class="glass-card-strong rounded-2xl shadow-xl p-8 mb-8 border border-white/10">
            <h2 class="text-3xl font-bold gradient-text mb-6">How to Improve Your BCI</h2>
            ${improvements}
        </div>
        
        <div class="glass-card-strong rounded-2xl shadow-xl p-8 mb-8 border border-white/10 fade-in">
            <h2 class="text-3xl font-bold gradient-text mb-4">Key Takeaways</h2>
            <ul class="space-y-3 text-lg text-gray-400">
                <li>✓ Your ${data.name} configuration achieves ${metrics.accuracy}% accuracy with ${metrics.latency}ms response time</li>
                <li>✓ ${data.invasiveness === 1 ? 'Non-invasive and completely safe' : 'Requires surgical procedure'}</li>
                <li>✓ Total cost: $${metrics.cost.toLocaleString()}</li>
                <li>✓ Best for: ${getBestUseCase(selectedModality, metrics.accuracy)}</li>
            </ul>
        </div>
    `;
}

function generateMetricCard(label, value, type) {
    let displayValue, description, rating;
    
    switch(type) {
        case 'accuracy':
            displayValue = `${value}%`;
            if (value >= 90) {
                rating = 'Excellent - Medical Grade';
                description = 'Your configuration achieves excellent accuracy suitable for critical medical applications like prosthetic control.';
            } else if (value >= 80) {
                rating = 'Very Good - Research Quality';
                description = 'Great accuracy for research applications and advanced BCI systems.';
            } else if (value >= 70) {
                rating = 'Good - Consumer/Gaming';
                description = 'Suitable for gaming, entertainment, and basic BCI applications.';
            } else {
                rating = 'Basic';
                description = 'Basic accuracy. Consider increasing electrodes or reducing noise for better performance.';
            }
            break;
        case 'latency':
            displayValue = `${value} ms`;
            if (value < 50) {
                rating = 'Excellent - Real-time';
                description = 'Ultra-fast response time, faster than human reaction time!';
            } else if (value < 200) {
                rating = 'Very Good';
                description = 'Fast enough for real-time control applications.';
            } else if (value < 1000) {
                rating = 'Good';
                description = 'Acceptable for most applications, though not ideal for time-critical tasks.';
            } else {
                rating = 'Slow';
                description = 'Significant delay. Typical for fNIRS, which measures blood flow rather than electrical signals.';
            }
            break;
        case 'invasiveness':
            displayValue = `${value}/5`;
            if (value === 1) {
                rating = 'Non-invasive - Completely Safe';
                description = 'No surgery required. Completely safe and reversible.';
            } else if (value === 3) {
                rating = 'Semi-invasive - Surgery Required';
                description = 'Requires craniotomy (skull opening) but electrodes stay on brain surface.';
            } else {
                rating = 'Invasive - High Risk';
                description = 'Requires brain surgery with significant medical risks.';
            }
            break;
        case 'cost':
            displayValue = `$${value.toLocaleString()}`;
            if (value < 2000) {
                rating = 'Affordable - Consumer Level';
                description = 'Affordable for individuals and small research groups.';
            } else if (value < 10000) {
                rating = 'Moderate - Research Grade';
                description = 'Professional equipment suitable for research institutions.';
            } else if (value < 50000) {
                rating = 'Expensive - Clinical Grade';
                description = 'High-end equipment, typically for clinical or advanced research use.';
            } else {
                rating = 'Very Expensive - Medical Procedure';
                description = 'Includes major surgery. Only for critical medical applications.';
            }
            break;
    }
    
    return `
        <div class="modality-card glass-card-strong rounded-3xl shadow-2xl overflow-hidden cursor-pointer border border-white/10 p-4">
            <h3 class="text-2xl font-bold text-white mb-2">${label}</h3>
            <div class="text-5xl font-bold gradient-text mb-2">${displayValue}</div>
            <p class="text-lg font-semibold text-gray-400 mb-2">${rating}</p>
            <p class="text-gray-400">${description}</p>
        </div>
    `;
}

function getUseCases(accuracy, modality) {
    const suitable = [];
    const notRecommended = [];
    
    if (accuracy >= 70) {
        suitable.push('Gaming and entertainment');
        suitable.push('Neuroscience research');
        suitable.push('Cognitive workload monitoring');
        suitable.push('Meditation and neurofeedback');
    }
    
    if (accuracy >= 80) {
        suitable.push('Educational demonstrations');
        suitable.push('Advanced research prototypes');
    }
    
    if (accuracy >= 90) {
        suitable.push('Medical prosthetic control');
        suitable.push('Communication systems');
    } else {
        notRecommended.push('Medical prosthetic control (need >90% accuracy)');
        notRecommended.push('Critical communication systems');
    }
    
    if (modality === 'emg') {
        notRecommended.push('Users with complete paralysis (EMG requires muscle function)');
    }
    
    return `
        <div class="space-y-4">
            <div>
                <h3 class="text-xl font-bold text-white mb-3">✓ Suitable Applications</h3>
                <ul class="space-y-2">
                    ${suitable.map(app => `<li class="text-gray-400">✓ ${app}</li>`).join('')}
                </ul>
            </div>
            ${notRecommended.length > 0 ? `
            <div>
                <h3 class="text-xl font-bold text-white mb-3">✗ Not Recommended For</h3>
                <ul class="space-y-2">
                    ${notRecommended.map(app => `<li class="text-gray-400">✗ ${app}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `;
}

function getImprovements(modality, params, metrics) {
    const suggestions = [];
    
    if (params.electrodes < 64) {
        const newAccuracy = calculateAccuracy(modality, 128, params.noise, params.training);
        const newCost = calculateCost(modality, 128, params.noise);
        suggestions.push({
            title: 'Add More Electrodes',
            change: `${params.electrodes} → 128 electrodes`,
            improvement: `Accuracy: ${metrics.accuracy}% → ${newAccuracy}%`,
            tradeoff: `Cost: $${metrics.cost.toLocaleString()} → $${newCost.toLocaleString()}`,
            description: 'Better spatial resolution and signal quality, but significantly more expensive.'
        });
    }
    
    if (params.noise > 3) {
        const newAccuracy = calculateAccuracy(modality, params.electrodes, 2, params.training);
        const newCost = calculateCost(modality, params.electrodes, 2);
        suggestions.push({
            title: 'Reduce Noise Level',
            change: `Noise: ${params.noise.toFixed(1)} → 2.0 (Low)`,
            improvement: `Accuracy: ${metrics.accuracy}% → ${newAccuracy}%`,
            tradeoff: `Cost: $${metrics.cost.toLocaleString()} → $${newCost.toLocaleString()}`,
            description: 'Professional-grade noise filtering equipment provides cleaner signals.'
        });
    }
    
    if (params.training < 50) {
        const newAccuracy = calculateAccuracy(modality, params.electrodes, params.noise, 100);
        suggestions.push({
            title: 'Extended Training',
            change: `${params.training}h → 100h training`,
            improvement: `Accuracy: ${metrics.accuracy}% → ${newAccuracy}%`,
            tradeoff: 'No additional cost, but significant time investment',
            description: 'The system learns your brain patterns better over time, and you get better at controlling it.'
        });
    }
    
    return `
        <div class="grid gap-6">
            ${suggestions.map(s => `
                <div class="modality-card glass-card-strong rounded-3xl shadow-2xl overflow-hidden cursor-pointer border border-white/10 p-4">
                    <h3 class="text-2xl font-bold text-white mb-2">${s.title}</h3>
                    <p class="text-lg text-gray-400 mb-2"><strong>Change:</strong> ${s.change}</p>
                    <p class="text-lg text-gray-400 mb-2"><strong>Improvement:</strong> ${s.improvement}</p>
                    <p class="text-lg text-gray-400 mb-2"><strong>Tradeoff:</strong> ${s.tradeoff}</p>
                    <p class="text-gray-400">${s.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function getBestUseCase(modality, accuracy) {
    if (modality === 'emg') return 'Prosthetic limb control and muscle-based interfaces';
    if (modality === 'fnirs') return 'Mobile applications and real-world monitoring';
    if (modality === 'ecog') return 'High-performance medical BCIs';
    if (accuracy >= 90) return 'Medical applications and critical systems';
    if (accuracy >= 80) return 'Research and advanced applications';
    return 'Gaming, entertainment, and basic research';
}

async function starConfiguration() {
    const { selectedModality, parameters, metrics } = appState;
    
    if (!selectedModality) {
        showToast('Please configure a BCI first', 'error');
        return;
    }
    
    // Show styled modal
    const modal = document.getElementById('star-modal');
    const input = document.getElementById('star-name-input');
    const cancelBtn = document.getElementById('star-cancel-btn');
    const confirmBtn = document.getElementById('star-confirm-btn');
    
    if (!modal || !input || !cancelBtn || !confirmBtn) {
        console.error('Star modal elements not found!');
        return;
    }
    
    // Generate default name
    const defaultName = `${modalityData[selectedModality].name} - ${parameters.electrodes} electrodes`;
    input.value = defaultName;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        input.focus();
        input.select();
    }, 100);
    
    // Remove old listeners if any
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newConfirmBtn = confirmBtn.cloneNode(true);
    cancelBtn.replaceWith(newCancelBtn);
    confirmBtn.replaceWith(newConfirmBtn);
    
    // Handle cancel
    newCancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    // Handle confirm
    newConfirmBtn.addEventListener('click', async () => {
        const name = input.value.trim() || defaultName;
        
        try {
            const response = await fetch('/api/star-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    modality: selectedModality,
                    parameters: parameters,
                    metrics: metrics,
                    name: name
                })
            });
            
            const data = await response.json();
            if (data.success) {
                showToast('Configuration starred! View it in your account.', 'success');
                modal.classList.add('hidden');
            } else {
                showToast('Error starring configuration', 'error');
            }
        } catch (error) {
            showToast('Error starring configuration', 'error');
        }
    });
    
    // Handle Enter key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            newConfirmBtn.click();
        } else if (e.key === 'Escape') {
            modal.classList.add('hidden');
        }
    });

}