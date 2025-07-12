// Undo/Redo Manager for SMeditor
// Implements Command pattern with memory-efficient history management

class UndoManager {
    constructor(maxHistory = 50) {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = maxHistory;
        this.isExecuting = false; // Prevent recursive undo/redo
        this.groupedActions = []; // For grouping related actions
        this.isGrouping = false;
        
        this.setupKeyboardShortcuts();
        this.setupEventListeners();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            
            // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                this.redo();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
        });
    }
    
    setupEventListeners() {
        // Listen for window focus to update UI
        window.addEventListener('focus', () => {
            this.updateUndoRedoUI();
        });
    }
    
    // Record a new action
    recordAction(action) {
        if (this.isExecuting) return; // Prevent recording during undo/redo
        
        // Clear future history if we're not at the end
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        // Add the action
        this.history.push(action);
        this.currentIndex++;
        
        // Maintain history size limit
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }
        
        this.updateUndoRedoUI();
        this.saveToLocalStorage();
    }
    
    // Group multiple actions together
    beginGroup() {
        this.isGrouping = true;
        this.groupedActions = [];
    }
    
    endGroup() {
        if (this.groupedActions.length > 0) {
            const groupedAction = new GroupedAction(this.groupedActions);
            this.recordAction(groupedAction);
        }
        this.isGrouping = false;
        this.groupedActions = [];
    }
    
    // Add action to current group
    addToGroup(action) {
        if (this.isGrouping) {
            this.groupedActions.push(action);
        } else {
            this.recordAction(action);
        }
    }
    
    // Undo the last action
    undo() {
        if (this.canUndo()) {
            this.isExecuting = true;
            const action = this.history[this.currentIndex];
            action.undo();
            this.currentIndex--;
            this.isExecuting = false;
            this.updateUndoRedoUI();
            this.saveToLocalStorage();
            
            // Show feedback
            this.showFeedback('Undo: ' + action.description);
        }
    }
    
    // Redo the next action
    redo() {
        if (this.canRedo()) {
            this.isExecuting = true;
            this.currentIndex++;
            const action = this.history[this.currentIndex];
            action.execute();
            this.isExecuting = false;
            this.updateUndoRedoUI();
            this.saveToLocalStorage();
            
            // Show feedback
            this.showFeedback('Redo: ' + action.description);
        }
    }
    
    // Check if undo is available
    canUndo() {
        return this.currentIndex >= 0;
    }
    
    // Check if redo is available
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
    
    // Clear all history
    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.updateUndoRedoUI();
        this.saveToLocalStorage();
    }
    
    // Update UI buttons
    updateUndoRedoUI() {
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        if (undoBtn) {
            undoBtn.disabled = !this.canUndo();
            undoBtn.classList.toggle('disabled', !this.canUndo());
        }
        
        if (redoBtn) {
            redoBtn.disabled = !this.canRedo();
            redoBtn.classList.toggle('disabled', !this.canRedo());
        }
        
        // Update keyboard shortcut hints
        this.updateShortcutHints();
    }
    
    // Update shortcut hints in UI
    updateShortcutHints() {
        const undoHint = document.getElementById('undo-hint');
        const redoHint = document.getElementById('redo-hint');
        
        if (undoHint) {
            undoHint.textContent = this.canUndo() ? 'Ctrl+Z' : 'No actions to undo';
        }
        
        if (redoHint) {
            redoHint.textContent = this.canRedo() ? 'Ctrl+Shift+Z' : 'No actions to redo';
        }
    }
    
    // Show feedback message
    showFeedback(message) {
        if (window.smeditor && window.smeditor.showFeedback) {
            window.smeditor.showFeedback(message);
        } else {
            console.log(message);
        }
    }
    
    // Save to localStorage for persistence
    saveToLocalStorage() {
        try {
            const data = {
                history: this.history.map(action => action.serialize()),
                currentIndex: this.currentIndex
            };
            localStorage.setItem('smeditor-undo-history', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save undo history:', error);
        }
    }
    
    // Load from localStorage
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('smeditor-undo-history');
            if (data) {
                const parsed = JSON.parse(data);
                this.history = parsed.history.map(actionData => this.deserializeAction(actionData));
                this.currentIndex = parsed.currentIndex;
                this.updateUndoRedoUI();
            }
        } catch (error) {
            console.warn('Could not load undo history:', error);
        }
    }
    
    // Deserialize action from stored data
    deserializeAction(actionData) {
        const actionTypes = {
            'ContainerAction': ContainerAction,
            'TemplateAction': TemplateAction,
            'ContentAction': ContentAction,
            'BrandAction': BrandAction,
            'GroupedAction': GroupedAction
        };
        
        const ActionClass = actionTypes[actionData.type];
        if (ActionClass) {
            return ActionClass.deserialize(actionData);
        }
        
        return null;
    }
    
    // Get history statistics
    getStats() {
        return {
            totalActions: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            memoryUsage: this.history.reduce((sum, action) => sum + action.getMemorySize(), 0)
        };
    }
}

// Base Action class
class Action {
    constructor(description) {
        this.description = description;
        this.timestamp = Date.now();
    }
    
    execute() {
        // Override in subclasses
    }
    
    undo() {
        // Override in subclasses
    }
    
    serialize() {
        return {
            type: this.constructor.name,
            description: this.description,
            timestamp: this.timestamp
        };
    }
    
    static deserialize(data) {
        return new this(data.description);
    }
    
    getMemorySize() {
        return JSON.stringify(this.serialize()).length;
    }
}

// Container-related actions
class ContainerAction extends Action {
    constructor(containerIndex, actionType, oldData, newData) {
        super(`${actionType} container ${containerIndex + 1}`);
        this.containerIndex = containerIndex;
        this.actionType = actionType;
        this.oldData = oldData;
        this.newData = newData;
    }
    
    execute() {
        const container = document.querySelector(`[data-index="${this.containerIndex}"]`);
        if (container) {
            switch (this.actionType) {
                case 'add':
                    this.addContentToContainer(container, this.newData);
                    break;
                case 'remove':
                    this.removeContentFromContainer(container);
                    break;
                case 'update':
                    this.updateContainerContent(container, this.newData);
                    break;
            }
        }
    }
    
    undo() {
        const container = document.querySelector(`[data-index="${this.containerIndex}"]`);
        if (container) {
            switch (this.actionType) {
                case 'add':
                    this.removeContentFromContainer(container);
                    break;
                case 'remove':
                    this.addContentToContainer(container, this.oldData);
                    break;
                case 'update':
                    this.updateContainerContent(container, this.oldData);
                    break;
            }
        }
    }
    
    addContentToContainer(container, data) {
        container.innerHTML = data.html;
        container.classList.add('filled');
        
        // Update SMeditor state
        if (window.smeditor) {
            window.smeditor.containers.set(this.containerIndex, data.containerData);
            window.smeditor.updateSceneStats();
        }
    }
    
    removeContentFromContainer(container) {
        container.innerHTML = '';
        container.classList.remove('filled');
        
        // Update SMeditor state
        if (window.smeditor) {
            window.smeditor.containers.delete(this.containerIndex);
            window.smeditor.updateSceneStats();
        }
    }
    
    updateContainerContent(container, data) {
        container.innerHTML = data.html;
        
        // Update SMeditor state
        if (window.smeditor) {
            window.smeditor.containers.set(this.containerIndex, data.containerData);
        }
    }
    
    serialize() {
        return {
            ...super.serialize(),
            containerIndex: this.containerIndex,
            actionType: this.actionType,
            oldData: this.oldData,
            newData: this.newData
        };
    }
    
    static deserialize(data) {
        const action = new this(data.containerIndex, data.actionType, data.oldData, data.newData);
        action.timestamp = data.timestamp;
        return action;
    }
}

// Template change actions
class TemplateAction extends Action {
    constructor(oldTemplate, newTemplate) {
        super(`Switch template from ${oldTemplate} to ${newTemplate}`);
        this.oldTemplate = oldTemplate;
        this.newTemplate = newTemplate;
    }
    
    execute() {
        if (window.smeditor) {
            window.smeditor.switchTemplate(this.newTemplate);
        }
    }
    
    undo() {
        if (window.smeditor) {
            window.smeditor.switchTemplate(this.oldTemplate);
        }
    }
    
    serialize() {
        return {
            ...super.serialize(),
            oldTemplate: this.oldTemplate,
            newTemplate: this.newTemplate
        };
    }
    
    static deserialize(data) {
        const action = new this(data.oldTemplate, data.newTemplate);
        action.timestamp = data.timestamp;
        return action;
    }
}

// Content editing actions
class ContentAction extends Action {
    constructor(containerIndex, field, oldValue, newValue) {
        super(`Edit ${field} in container ${containerIndex + 1}`);
        this.containerIndex = containerIndex;
        this.field = field;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
    
    execute() {
        if (window.smeditor) {
            const containerData = window.smeditor.containers.get(this.containerIndex);
            if (containerData && containerData.content) {
                containerData.content[this.field] = this.newValue;
            }
        }
    }
    
    undo() {
        if (window.smeditor) {
            const containerData = window.smeditor.containers.get(this.containerIndex);
            if (containerData && containerData.content) {
                containerData.content[this.field] = this.oldValue;
            }
        }
    }
    
    serialize() {
        return {
            ...super.serialize(),
            containerIndex: this.containerIndex,
            field: this.field,
            oldValue: this.oldValue,
            newValue: this.newValue
        };
    }
    
    static deserialize(data) {
        const action = new this(data.containerIndex, data.field, data.oldValue, data.newValue);
        action.timestamp = data.timestamp;
        return action;
    }
}

// Brand settings actions
class BrandAction extends Action {
    constructor(setting, oldValue, newValue) {
        super(`Update ${setting} setting`);
        this.setting = setting;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
    
    execute() {
        if (window.smeditor) {
            window.smeditor.brandSettings[this.setting] = this.newValue;
            window.smeditor.updateBrandPreview();
        }
    }
    
    undo() {
        if (window.smeditor) {
            window.smeditor.brandSettings[this.setting] = this.oldValue;
            window.smeditor.updateBrandPreview();
        }
    }
    
    serialize() {
        return {
            ...super.serialize(),
            setting: this.setting,
            oldValue: this.oldValue,
            newValue: this.newValue
        };
    }
    
    static deserialize(data) {
        const action = new this(data.setting, data.oldValue, data.newValue);
        action.timestamp = data.timestamp;
        return action;
    }
}

// Grouped actions for complex operations
class GroupedAction extends Action {
    constructor(actions) {
        const descriptions = actions.map(a => a.description).join(', ');
        super(`Multiple actions: ${descriptions}`);
        this.actions = actions;
    }
    
    execute() {
        this.actions.forEach(action => action.execute());
    }
    
    undo() {
        // Execute undo in reverse order
        for (let i = this.actions.length - 1; i >= 0; i--) {
            this.actions[i].undo();
        }
    }
    
    serialize() {
        return {
            ...super.serialize(),
            actions: this.actions.map(action => action.serialize())
        };
    }
    
    static deserialize(data) {
        const actions = data.actions.map(actionData => {
            const actionTypes = {
                'ContainerAction': ContainerAction,
                'TemplateAction': TemplateAction,
                'ContentAction': ContentAction,
                'BrandAction': BrandAction
            };
            const ActionClass = actionTypes[actionData.type];
            return ActionClass ? ActionClass.deserialize(actionData) : null;
        }).filter(Boolean);
        
        const action = new this(actions);
        action.timestamp = data.timestamp;
        return action;
    }
}

// Global undo manager instance
window.UndoManager = new UndoManager(); 