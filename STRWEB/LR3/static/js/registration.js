document.addEventListener('DOMContentLoaded', function() {
    const birthDateInput = document.querySelector('[name="birth_date"]');
    const messageContainer = document.getElementById('birth-date-message');

    if (birthDateInput) {
        birthDateInput.addEventListener('change', function() {
            const birthDate = new Date(this.value);
            if (!isNaN(birthDate.getTime())) {
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();

                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age < 18) {
                    alert('Вам должно быть 18 лет для регистрации. Необходимо разрешение родителей.');
                    if (messageContainer) {
                        messageContainer.textContent = '';
                    }
                } else {
                    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
                    const dayOfWeek = days[birthDate.getDay()];
                    if (messageContainer) {
                        messageContainer.textContent = `Вы родились в ${dayOfWeek}.`;
                    }
                }
            }
        });
    }
});
