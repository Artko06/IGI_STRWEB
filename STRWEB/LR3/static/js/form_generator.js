document.addEventListener('DOMContentLoaded', () => {
    const generatorCheckbox = document.getElementById('generator-checkbox');
    const container = document.getElementById('generated-elements-container');
    let elements = [];

    function saveState() {
        localStorage.setItem('generatedCheckboxes', JSON.stringify(elements));
    }

    function loadState() {
        const savedElements = JSON.parse(localStorage.getItem('generatedCheckboxes'));
        if (savedElements) {
            elements = savedElements;
            renderAllElements();
        }
    }

    function renderAllElements() {
        container.innerHTML = '';
        elements.forEach(el => {
            const wrapper = document.createElement('div');
            wrapper.className = 'generated-element-wrapper';
            wrapper.dataset.id = el.id;

            wrapper.innerHTML = `
                <div class="control-panel">
                    <label for="name-${el.id}">Name:</label>
                    <input type="text" id="name-${el.id}" data-attr="name" value="${el.name}">

                    <label for="value-${el.id}">Value:</label>
                    <input type="text" id="value-${el.id}" data-attr="value" value="${el.value}">

                    <label for="checked-${el.id}">Checked:</label>
                    <div><input type="checkbox" id="checked-${el.id}" data-attr="checked" ${el.checked ? 'checked' : ''}></div>

                    <label for="required-${el.id}">Required:</label>
                    <div><input type="checkbox" id="required-${el.id}" data-attr="required" ${el.required ? 'checked' : ''}></div>

                    <label for="disabled-${el.id}">Disabled:</label>
                    <div><input type="checkbox" id="disabled-${el.id}" data-attr="disabled" ${el.disabled ? 'checked' : ''}></div>
                    
                    <span></span>
                    <button class="delete-btn" data-id="${el.id}">Удалить</button>
                </div>
                <div class="generated-checkbox-display">
                    <label>
                        <input type="checkbox" 
                               class="generated-checkbox"
                               name="${el.name}" 
                               value="${el.value}"
                               ${el.checked ? 'checked' : ''}
                               ${el.required ? 'required' : ''}
                               ${el.disabled ? 'disabled' : ''}>
                        (Label: ${el.name || '...'})
                    </label>
                </div>
            `;
            container.appendChild(wrapper);
        });
    }

    // --- Event Handlers ---
    function handleAddElement() {
        const newElement = {
            id: Date.now(),
            name: 'checkbox' + elements.length,
            value: 'on',
            checked: false,
            required: false,
            disabled: false
        };
        elements.push(newElement);
        saveState();
        renderAllElements();
        generatorCheckbox.checked = false; // Reset the main checkbox
    }

    function handleUpdateElement(e) {
        const target = e.target;
        const wrapper = target.closest('.generated-element-wrapper');
        if (!wrapper) return;

        const id = Number(wrapper.dataset.id);
        const attr = target.dataset.attr;
        const elementState = elements.find(el => el.id === id);
        if (!elementState) return;

        const value = target.type === 'checkbox' ? target.checked : target.value;
        elementState[attr] = value;
        saveState();

        const checkboxToUpdate = wrapper.querySelector('.generated-checkbox');
        if (target.type === 'checkbox') {
            checkboxToUpdate[attr] = value;
        } else {
            checkboxToUpdate.setAttribute(attr, value);
        }

        if (attr === 'name') {
            const labelToUpdate = wrapper.querySelector('.generated-checkbox-display label');
            labelToUpdate.lastChild.textContent = ` (Label: ${value || '...'})`;
        }
    }

    function handleDeleteElement(e) {
        if (!e.target.classList.contains('delete-btn')) return;
        
        const id = Number(e.target.dataset.id);
        elements = elements.filter(el => el.id !== id);
        saveState();
        renderAllElements();
    }

    if (generatorCheckbox && container) {
        generatorCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                handleAddElement();
            }
        });
        container.addEventListener('input', handleUpdateElement);
        container.addEventListener('click', handleDeleteElement);
        loadState();
    }
});