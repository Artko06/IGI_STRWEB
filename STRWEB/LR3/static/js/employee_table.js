document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.employee-table');
    if (!table) return;

    // DOM Elements
    const tbody = table.querySelector('tbody');
    const headers = table.querySelectorAll('th[data-sort-by]');
    const paginationControls = document.querySelector('.pagination-controls');
    const detailsDisplay = document.getElementById('employee-details-display');
    const bonusTextContainer = document.getElementById('bonus-text-container');
    const employeeTableSection = document.querySelector('.employee-table-section');
    const preloaderContainer = document.querySelector('.preloader-container');
    
    // Controls
    const filterForm = document.getElementById('employee-filter-form');
    const filterInput = document.getElementById('filter-input');
    const showAddFormBtn = document.getElementById('show-add-form-btn');
    const addFormContainer = document.getElementById('add-form-container');
    const addEmployeeForm = document.getElementById('add-employee-form');
    const grantBonusBtn = document.getElementById('grant-bonus-btn');
    const selectAllCheckbox = document.getElementById('select-all-employees');

    // Add Form Inputs
    const urlInput = document.getElementById('url');
    const urlValidationMessage = document.getElementById('url-validation-message');
    const phoneInput = document.getElementById('phone');
    const phoneValidationMessage = document.getElementById('phone-validation-message');

    // Data state
    let originalRows = [];
    let displayedRows = [];
    const rowsPerPage = 3;
    let currentPage = 1;

    async function fetchData() {
        try {
            preloaderContainer.style.display = 'flex'; // Show preloader
            employeeTableSection.style.display = 'none'; // Hide table

            const response = await fetch('/api/employees/');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            originalRows = data.map(createRowElement);
            displayedRows = [...originalRows];
            
            initialize();
        } catch (error) {
            console.error("Could not fetch employee data:", error);
            tbody.innerHTML = `<tr><td colspan="7">Не удалось загрузить данные.</td></tr>`;
        } finally {
            preloaderContainer.style.display = 'none'; // Hide preloader
            employeeTableSection.style.display = 'block'; // Show table
        }
    }

    function createRowElement(employee) {
        const row = document.createElement('tr');
        row.dataset.employeeId = employee.id;
        const defaultPhotoUrl = '/media/images/default.jpg';
        const photoUrl = employee.photo_url || defaultPhotoUrl;

        row.innerHTML = `
            <td><input type="checkbox" class="select-employee" data-employee-id="${employee.id}"></td>
            <td>${employee.name}</td>
            <td><img src="${photoUrl}" alt="${employee.name}" width="50" height="50" style="object-fit: cover" onerror="this.onerror=null;this.src='${defaultPhotoUrl}';"></td>
            <td>${employee.job_description}</td>
            <td><a href="tel:${employee.phone}">${employee.phone}</a></td>
            <td><a href="mailto:${employee.email}">${employee.email}</a></td>
            <td><a href="${employee.url}" target="_blank">${employee.url || ''}</a></td>
        `;
        return row;
    }

    function initialize() {
        setupEventListeners();
        setupPagination();
        displayPage(currentPage);
    }

    function setupEventListeners() {
        headers.forEach(header => {
            header.addEventListener('click', () => handleSort(header));
        });

        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleFilter();
            });
        }

        tbody.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT') return;
            const row = e.target.closest('tr');
            if (row) handleRowClick(row);
        });

        if (showAddFormBtn) {
            showAddFormBtn.addEventListener('click', () => {
                addFormContainer.hidden = !addFormContainer.hidden;
            });
        }

        if (addEmployeeForm) {
            addEmployeeForm.addEventListener('submit', handleAddEmployee);
        }

        if (grantBonusBtn) {
            grantBonusBtn.addEventListener('click', handleGrantBonus);
        }

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('click', handleSelectAll);
        }
    }

    // --- Validation ---
    function validateUrl(url) {
        if (!url) return true;
        const urlRegex = /^(https?:\/\/).*\.(php|html)$/;
        return urlRegex.test(url);
    }

    function validatePhone(phone) {
        if (!phone) return false;
        const phoneRegex = /^(?:\+375|8)\s?\(?\d{2,3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
        return phoneRegex.test(phone);
    }

    function setInputValidation(inputElement, messageElement, isValid, message) {
        if (!inputElement) return;
        if (isValid) {
            inputElement.style.borderColor = '';
            inputElement.style.backgroundColor = '';
            messageElement.textContent = '';
        } else {
            inputElement.style.borderColor = 'red';
            inputElement.style.backgroundColor = 'pink';
            messageElement.textContent = message;
            messageElement.style.color = 'red';
        }
    }

    function handleSort(header) {
        const currentDirection = header.getAttribute('data-sort-direction');
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        const columnIndex = Array.from(header.parentNode.children).indexOf(header);

        headers.forEach(h => {
            if (h !== header) h.removeAttribute('data-sort-direction');
            const icon = h.querySelector('.sort-icon');
            if (icon) icon.textContent = '';
        });

        header.setAttribute('data-sort-direction', newDirection);
        sortRows(columnIndex, newDirection);
        updateSortIcon(header, newDirection);
    }

    function handleFilter() {
        const searchTerm = filterInput.value.toLowerCase();
        displayedRows = searchTerm === ''
            ? [...originalRows]
            : originalRows.filter(row => row.textContent.toLowerCase().includes(searchTerm));
        
        currentPage = 1;
        setupPagination();
        displayPage(currentPage);
    }

    function handleRowClick(row) {
        tbody.querySelectorAll('tr').forEach(r => r.classList.remove('active-row'));
        row.classList.add('active-row');

        const cells = row.children;
        const photoSrc = cells[2].querySelector('img').src;
        const name = cells[1].textContent;
        const urlText = cells[6].textContent.trim();

        detailsDisplay.innerHTML = `
            <h3>Детали сотрудника</h3>
            <div class="details-content">
                <img src="${photoSrc}" alt="${name}" width="100" height="100" style="object-fit: cover">
                <div>
                    <p><strong>ФИО:</strong> ${name}</p>
                    <p><strong>Должность:</strong> ${cells[3].textContent}</p>
                    <p><strong>Телефон:</strong> ${cells[4].textContent}</p>
                    <p><strong>Email:</strong> ${cells[5].textContent}</p>
                    ${urlText ? `<p><strong>URL:</strong> <a href="${urlText}" target="_blank">${urlText}</a></p>` : ''}
                </div>
            </div>
        `;
    }

    async function handleAddEmployee(e) {
        e.preventDefault();
        
        const isUrlValid = validateUrl(urlInput.value);
        setInputValidation(urlInput, urlValidationMessage, isUrlValid, 'URL должен начинаться с http(s):// и заканчиваться на .php или .html');

        const isPhoneValid = validatePhone(phoneInput.value);
        setInputValidation(phoneInput, phoneValidationMessage, isPhoneValid, 'Неверный формат телефона.');

        if (!isUrlValid || !isPhoneValid) return;

        const formData = new FormData(addEmployeeForm);
        
        try {
            const response = await fetch('/api/employees/add/', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                const newRow = createRowElement(result.employee);
                originalRows.push(newRow);
                handleFilter();
                addFormContainer.hidden = true;
                addEmployeeForm.reset();
                setInputValidation(urlInput, urlValidationMessage, true);
                setInputValidation(phoneInput, phoneValidationMessage, true);
            } else {
                alert(`Ошибка: ${result.error}`);
            }
        } catch (error) {
            console.error('Failed to add employee:', error);
            alert('Не удалось добавить сотрудника.');
        }
    }

    function handleGrantBonus() {
        const selectedCheckboxes = tbody.querySelectorAll('.select-employee:checked');
        if (selectedCheckboxes.length === 0) {
            bonusTextContainer.innerHTML = '<p>Пожалуйста, выберите хотя бы одного сотрудника для премирования.</p>';
            return;
        }

        const selectedNames = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.children[1].textContent.trim();
        });

        bonusTextContainer.innerHTML = `
            <h3>Приказ о премировании</h3>
            <p>Премировать следующих сотрудников: <strong>${selectedNames.join(', ')}</strong>.</p>
        `;
    }

    function handleSelectAll() {
        const isChecked = selectAllCheckbox.checked;
        tbody.querySelectorAll('.select-employee').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }

    function sortRows(columnIndex, direction) {
        const collator = new Intl.Collator(['ru', 'en'], { numeric: true, sensitivity: 'base' });
        displayedRows.sort((rowA, rowB) => {
            const valA = rowA.children[columnIndex].textContent.trim();
            const valB = rowB.children[columnIndex].textContent.trim();
            const comparison = collator.compare(valA, valB);
            return direction === 'asc' ? comparison : -comparison;
        });
        displayPage(currentPage);
    }

    function updateSortIcon(header, direction) {
        const icon = header.querySelector('.sort-icon');
        if (icon) icon.textContent = direction === 'asc' ? ' ▲' : ' ▼';
    }

    // --- Pagination ---
    function displayPage(page) {
        currentPage = page;
        tbody.innerHTML = '';
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = displayedRows.slice(start, end);
        paginatedItems.forEach(row => tbody.appendChild(row));
        updatePaginationButtons();
    }

    function setupPagination() {
        paginationControls.innerHTML = '';
        const pageCount = Math.ceil(displayedRows.length / rowsPerPage);
        if (pageCount <= 1) return;

        const prevButton = createPaginationButton('Назад', () => {
            if (currentPage > 1) displayPage(currentPage - 1);
        });
        paginationControls.appendChild(prevButton);

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = createPaginationButton(i, () => displayPage(i));
            pageButton.classList.add('page-btn');
            paginationControls.appendChild(pageButton);
        }

        const nextButton = createPaginationButton('Вперед', () => {
            if (currentPage < pageCount) displayPage(currentPage + 1);
        });
        paginationControls.appendChild(nextButton);
        
        updatePaginationButtons();
    }
    
    function createPaginationButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    function updatePaginationButtons() {
        const pageButtons = paginationControls.querySelectorAll('.page-btn');
        pageButtons.forEach(button => {
            button.classList.remove('active');
            if (parseInt(button.textContent) === currentPage) {
                button.classList.add('active');
            }
        });

        const prevButton = paginationControls.querySelector('button:first-child');
        const nextButton = paginationControls.querySelector('button:last-child');
        const pageCount = Math.ceil(displayedRows.length / rowsPerPage);
        if (prevButton) prevButton.disabled = currentPage === 1;
        if (nextButton) nextButton.disabled = currentPage === pageCount;
    }

    fetchData();
});