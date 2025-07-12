/**
 * Spatial Language Editor Interface
 * Advanced code editor for Advanced Spatial Programming Language (ASPL)
 * Developed by Fungai Taranhike
 */

class SpatialLanguageEditor {
    constructor() {
        this.creator = 'Fungai Taranhike';
        this.version = '1.0.0';
        this.language = null;
        this.editor = null;
        this.output = null;
        this.syntaxHighlighter = null;
        this.autocomplete = null;
        this.examples = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🧠 Initializing Spatial Language Editor...');
        console.log('👨‍💻 Creator: ' + this.creator);
        
        this.setupEditor();
        this.setupSyntaxHighlighting();
        this.setupAutocomplete();
        this.setupExamples();
        this.setupEventListeners();
        
        console.log('✅ Spatial Language Editor Active');
    }
    
    setupEditor() {
        // Create editor container
        const editorContainer = document.createElement('div');
        editorContainer.className = 'spatial-language-editor';
        editorContainer.innerHTML = `
            <div class="editor-header">
                <h3>🧠 Advanced Spatial Programming Language</h3>
                <span class="creator-signature">by ${this.creator}</span>
            </div>
            <div class="editor-toolbar">
                <button class="tool-btn" id="run-code">
                    <i class="fas fa-play"></i>
                    Run
                </button>
                <button class="tool-btn" id="clear-code">
                    <i class="fas fa-trash"></i>
                    Clear
                </button>
                <button class="tool-btn" id="load-example">
                    <i class="fas fa-file-code"></i>
                    Examples
                </button>
                <button class="tool-btn" id="save-code">
                    <i class="fas fa-save"></i>
                    Save
                </button>
            </div>
            <div class="editor-content">
                <div class="code-editor">
                    <textarea id="spatial-code-editor" placeholder="// Advanced Spatial Programming Language
// Developed by Fungai Taranhike

SPATIAL_CREATE position={x: 0, y: 0, z: 0} consciousness=0.5
CONSCIOUSNESS_CREATE level=0.7 emotional=excited
QUANTUM_CREATE state=0.5 superposition=true
BINARY_CREATE state=0b00000000 optimized=true"></textarea>
                </div>
                <div class="output-panel">
                    <div class="output-header">
                        <h4>Output</h4>
                        <button class="clear-output" id="clear-output">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="output-content" id="spatial-output">
                        <div class="output-message">
                            <span class="message-icon">🧠</span>
                            <span class="message-text">Advanced Spatial Programming Language Ready</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="editor-footer">
                <div class="language-info">
                    <span class="language-name">ASPL v2.0.0</span>
                    <span class="creator-info">by ${this.creator}</span>
                </div>
                <div class="status-indicator">
                    <span class="status-dot active"></span>
                    <span class="status-text">Ready</span>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(editorContainer);
        
        // Get references
        this.editor = document.getElementById('spatial-code-editor');
        this.output = document.getElementById('spatial-output');
        
        // Initialize language
        if (window.AdvancedSpatialLanguage) {
            this.language = new window.AdvancedSpatialLanguage();
        }
    }
    
    setupSyntaxHighlighting() {
        // Syntax highlighting rules
        this.syntaxHighlighter = {
            keywords: [
                'SPATIAL_CREATE', 'CONSCIOUSNESS_CREATE', 'QUANTUM_CREATE', 'BINARY_CREATE',
                'SPATIAL_DESTROY', 'CONSCIOUSNESS_DESTROY', 'QUANTUM_DESTROY', 'BINARY_DESTROY',
                'SPATIAL_TRANSFORM', 'CONSCIOUSNESS_MODIFY', 'QUANTUM_MEASURE', 'BINARY_OPTIMIZE',
                'SPATIAL_TELEPORT', 'CONSCIOUSNESS_QUERY', 'QUANTUM_ENTANGLE', 'BINARY_MATRIX',
                'HYPERSPATIAL', 'METACONSCIOUSNESS', 'QUANTUM_ENTANGLEMENT', 'BINARY_OPTIMIZATION',
                'DIMENSION', 'REALITY', 'EXISTENCE', 'AWARENESS', 'MEMORY', 'EMOTION'
            ],
            operators: ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', '^', '&', '|'],
            dataTypes: ['SPATIAL_VECTOR', 'CONSCIOUSNESS_LEVEL', 'QUANTUM_STATE', 'BINARY_MATRIX'],
            comments: ['//', '/*', '*/']
        };
        
        // Apply syntax highlighting
        this.applySyntaxHighlighting();
    }
    
    applySyntaxHighlighting() {
        if (!this.editor) return;
        
        const code = this.editor.value;
        let highlightedCode = code;
        
        // Highlight keywords
        this.syntaxHighlighter.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlightedCode = highlightedCode.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Highlight operators
        this.syntaxHighlighter.operators.forEach(operator => {
            const regex = new RegExp(`\\${operator}`, 'g');
            highlightedCode = highlightedCode.replace(regex, `<span class="operator">${operator}</span>`);
        });
        
        // Highlight data types
        this.syntaxHighlighter.dataTypes.forEach(dataType => {
            const regex = new RegExp(`\\b${dataType}\\b`, 'g');
            highlightedCode = highlightedCode.replace(regex, `<span class="datatype">${dataType}</span>`);
        });
        
        // Highlight comments
        highlightedCode = highlightedCode.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
        highlightedCode = highlightedCode.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
        
        // Highlight strings
        highlightedCode = highlightedCode.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
        highlightedCode = highlightedCode.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
        
        // Highlight numbers
        highlightedCode = highlightedCode.replace(/\b\d+\.?\d*\b/g, '<span class="number">$&</span>');
        
        // Create highlighted display
        const highlightedDisplay = document.createElement('div');
        highlightedDisplay.className = 'syntax-highlighted';
        highlightedDisplay.innerHTML = highlightedCode;
        highlightedDisplay.style.cssText = this.editor.style.cssText;
        
        // Replace editor content
        this.editor.parentNode.appendChild(highlightedDisplay);
        this.editor.style.display = 'none';
        
        // Sync scrolling
        this.editor.addEventListener('scroll', () => {
            highlightedDisplay.scrollTop = this.editor.scrollTop;
            highlightedDisplay.scrollLeft = this.editor.scrollLeft;
        });
        
        // Sync input
        this.editor.addEventListener('input', () => {
            this.applySyntaxHighlighting();
        });
    }
    
    setupAutocomplete() {
        // Autocomplete suggestions
        this.autocomplete = {
            suggestions: [
                // Spatial operations
                'SPATIAL_CREATE position={x: 0, y: 0, z: 0} consciousness=0.5',
                'SPATIAL_DESTROY id=object_id',
                'SPATIAL_TRANSFORM id=object_id position={x: 1, y: 1, z: 1}',
                'SPATIAL_TELEPORT id=object_id destination={x: 10, y: 10, z: 10}',
                
                // Consciousness operations
                'CONSCIOUSNESS_CREATE level=0.7 emotional=excited',
                'CONSCIOUSNESS_MODIFY id=consciousness_id level=0.8',
                'CONSCIOUSNESS_QUERY id=consciousness_id',
                'EMOTION_CREATE type=joy intensity=0.8',
                'MEMORY_STORE content="memory_content" type=spatial',
                'AWARENESS_CREATE level=0.6 focus=spatial',
                
                // Quantum operations
                'QUANTUM_CREATE state=0.5 superposition=true',
                'QUANTUM_MEASURE id=quantum_id',
                'QUANTUM_ENTANGLE particles=[particle1, particle2]',
                'QUANTUM_TELEPORT source=location1 destination=location2',
                
                // Binary operations
                'BINARY_CREATE state=0b00000000 optimized=true',
                'BINARY_OPTIMIZE id=binary_id',
                'BINARY_MATRIX size={rows: 4, cols: 4}',
                
                // Advanced operations
                'HYPERSPATIAL_NAVIGATE destination=hyperspace_location',
                'DIMENSION_CREATE name="new_dimension"',
                'REALITY_MODIFY modification=reality_change',
                'METACONSCIOUSNESS_CREATE type=advanced_consciousness'
            ],
            
            showSuggestions: (input) => {
                const suggestions = this.autocomplete.suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(input.toLowerCase())
                );
                
                if (suggestions.length > 0) {
                    this.showAutocompleteDropdown(suggestions);
                }
            },
            
            hideSuggestions: () => {
                const dropdown = document.querySelector('.autocomplete-dropdown');
                if (dropdown) {
                    dropdown.remove();
                }
            }
        };
    }
    
    showAutocompleteDropdown(suggestions) {
        // Remove existing dropdown
        this.autocomplete.hideSuggestions();
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = suggestion;
            item.onclick = () => {
                this.insertSuggestion(suggestion);
                this.autocomplete.hideSuggestions();
            };
            dropdown.appendChild(item);
        });
        
        // Position dropdown
        const rect = this.editor.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.top = (rect.bottom + 5) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
        
        document.body.appendChild(dropdown);
    }
    
    insertSuggestion(suggestion) {
        const cursorPos = this.editor.selectionStart;
        const textBefore = this.editor.value.substring(0, cursorPos);
        const textAfter = this.editor.value.substring(cursorPos);
        
        this.editor.value = textBefore + suggestion + textAfter;
        this.editor.setSelectionRange(cursorPos + suggestion.length, cursorPos + suggestion.length);
        this.editor.focus();
    }
    
    setupExamples() {
        // Example code snippets
        this.examples.set('basic_spatial', {
            name: 'Basic Spatial Operations',
            code: `// Basic Spatial Operations
// Developed by Fungai Taranhike

SPATIAL_CREATE position={x: 0, y: 0, z: 0} consciousness=0.5
SPATIAL_TRANSFORM id=spatial-1 position={x: 5, y: 5, z: 5}
SPATIAL_TELEPORT id=spatial-1 destination={x: 10, y: 10, z: 10}`
        });
        
        this.examples.set('consciousness_demo', {
            name: 'Consciousness Demo',
            code: `// Consciousness Operations Demo
// Developed by Fungai Taranhike

CONSCIOUSNESS_CREATE level=0.8 emotional=excited
EMOTION_CREATE type=joy intensity=0.9
MEMORY_STORE content="Spatial computing experience" type=spatial
AWARENESS_CREATE level=0.7 focus=spatial_environment`
        });
        
        this.examples.set('quantum_demo', {
            name: 'Quantum Operations Demo',
            code: `// Quantum Operations Demo
// Developed by Fungai Taranhike

QUANTUM_CREATE state=0.5 superposition=true
QUANTUM_ENTANGLE particles=[particle1, particle2] strength=0.8
QUANTUM_MEASURE id=quantum-1
QUANTUM_TELEPORT source=location1 destination=location2`
        });
        
        this.examples.set('binary_demo', {
            name: 'Binary Operations Demo',
            code: `// Binary Operations Demo
// Developed by Fungai Taranhike

BINARY_CREATE state=0b00000000 optimized=false
BINARY_OPTIMIZE id=binary-1
BINARY_MATRIX size={rows: 4, cols: 4} data=matrix_data
BINARY_FIELD_CREATE region={x: 0, y: 0, width: 100, height: 100}`
        });
        
        this.examples.set('advanced_demo', {
            name: 'Advanced Operations Demo',
            code: `// Advanced Operations Demo
// Developed by Fungai Taranhike

HYPERSPATIAL_NAVIGATE destination=hyperspace_location
DIMENSION_CREATE name="new_dimension" properties={spatial: true}
REALITY_MODIFY modification=reality_change
METACONSCIOUSNESS_CREATE type=advanced_consciousness level=0.9`
        });
    }
    
    setupEventListeners() {
        // Run code button
        document.getElementById('run-code').addEventListener('click', () => {
            this.runCode();
        });
        
        // Clear code button
        document.getElementById('clear-code').addEventListener('click', () => {
            this.clearCode();
        });
        
        // Load example button
        document.getElementById('load-example').addEventListener('click', () => {
            this.showExamples();
        });
        
        // Save code button
        document.getElementById('save-code').addEventListener('click', () => {
            this.saveCode();
        });
        
        // Clear output button
        document.getElementById('clear-output').addEventListener('click', () => {
            this.clearOutput();
        });
        
        // Editor input events
        this.editor.addEventListener('input', () => {
            this.updateStatus('Typing...');
        });
        
        this.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertAtCursor('    ');
            }
            
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.runCode();
            }
        });
    }
    
    runCode() {
        if (!this.language) {
            this.showOutput('❌ Advanced Spatial Programming Language not available', 'error');
            return;
        }
        
        const code = this.editor.value;
        if (!code.trim()) {
            this.showOutput('❌ No code to execute', 'error');
            return;
        }
        
        this.updateStatus('Running...');
        this.showOutput('🧠 Executing Advanced Spatial Programming Language code...', 'info');
        
        try {
            const result = this.language.execute(code);
            this.showOutput('✅ Code executed successfully', 'success');
            this.showOutput('📊 Results:', 'info');
            this.showOutput(JSON.stringify(result, null, 2), 'result');
        } catch (error) {
            this.showOutput('❌ Execution failed: ' + error.message, 'error');
        }
        
        this.updateStatus('Ready');
    }
    
    clearCode() {
        this.editor.value = '';
        this.updateStatus('Cleared');
    }
    
    showExamples() {
        const examplesList = Array.from(this.examples.entries()).map(([key, example]) => 
            `<div class="example-item" data-example="${key}">
                <h4>${example.name}</h4>
                <p>Click to load example code</p>
            </div>`
        ).join('');
        
        const modal = document.createElement('div');
        modal.className = 'examples-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🧠 Code Examples</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${examplesList}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.querySelectorAll('.example-item').forEach(item => {
            item.onclick = () => {
                const exampleKey = item.dataset.example;
                const example = this.examples.get(exampleKey);
                if (example) {
                    this.editor.value = example.code;
                    this.updateStatus('Example loaded');
                }
                modal.remove();
            };
        });
    }
    
    saveCode() {
        const code = this.editor.value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'spatial_language_code.aspl';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showOutput('💾 Code saved as spatial_language_code.aspl', 'success');
    }
    
    clearOutput() {
        this.output.innerHTML = `
            <div class="output-message">
                <span class="message-icon">🧠</span>
                <span class="message-text">Output cleared</span>
            </div>
        `;
    }
    
    showOutput(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `output-message ${type}`;
        
        const icon = type === 'error' ? '❌' : 
                    type === 'success' ? '✅' : 
                    type === 'result' ? '📊' : '🧠';
        
        messageDiv.innerHTML = `
            <span class="message-icon">${icon}</span>
            <span class="message-text">${message}</span>
        `;
        
        this.output.appendChild(messageDiv);
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    updateStatus(status) {
        const statusText = document.querySelector('.status-text');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText) statusText.textContent = status;
        if (statusDot) {
            statusDot.className = 'status-dot ' + (status === 'Ready' ? 'active' : 'busy');
        }
    }
    
    insertAtCursor(text) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const value = this.editor.value;
        
        this.editor.value = value.substring(0, start) + text + value.substring(end);
        this.editor.setSelectionRange(start + text.length, start + text.length);
    }
    
    // Public API Methods
    
    getCreator() {
        return this.creator;
    }
    
    getVersion() {
        return this.version;
    }
    
    getLanguage() {
        return this.language;
    }
    
    // Cleanup
    destroy() {
        console.log('🧠 Destroying Spatial Language Editor...');
        
        const editorContainer = document.querySelector('.spatial-language-editor');
        if (editorContainer) {
            editorContainer.remove();
        }
    }
}

// Initialize Spatial Language Editor
window.SpatialLanguageEditor = SpatialLanguageEditor; 