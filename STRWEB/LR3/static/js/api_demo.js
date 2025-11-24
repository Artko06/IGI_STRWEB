document.addEventListener('DOMContentLoaded', function () {
    // Geolocation
    const getGeolocationButton = document.getElementById('get-geolocation');
    const geolocationOutput = document.getElementById('geolocation-output');

    if (getGeolocationButton) {
        getGeolocationButton.addEventListener('click', () => {
            if ('geolocation' in navigator) {
                geolocationOutput.textContent = 'Получение местоположения...';
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude, accuracy } = position.coords;
                        geolocationOutput.innerHTML = `
                            <p>Широта: ${latitude.toFixed(6)}</p>
                            <p>Долгота: ${longitude.toFixed(6)}</p>
                            <p>Точность: ${accuracy.toFixed(2)} метров</p>
                        `;
                    },
                    (error) => {
                        geolocationOutput.textContent = `Ошибка получения местоположения: ${error.message}`;
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            } else {
                geolocationOutput.textContent = 'Геолокация не поддерживается вашим браузером.';
            }
        });
    }

    const getClipboardButton = document.getElementById('get-clipboard-status');
    const clipboardOutput = document.getElementById('clipboard-output');

    if (getClipboardButton && clipboardOutput) {
        getClipboardButton.addEventListener('click', async () => {
            if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
                try {
                    // Копируем в буфер обмена демонстрационный текст
                    const demoText = `Скопировано через Clipboard API!\nВремя: ${new Date().toLocaleTimeString()}\nСтраница: ${window.location.href}`;

                    await navigator.clipboard.writeText(demoText);

                    clipboardOutput.innerHTML = `
                        <p style="color: green;">✅ Текст успешно скопирован в буфер обмена!</p>
                        <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 10px 0;">
                            <strong>Скопированный текст:</strong><br>
                            <code>${demoText.replace(/\n/g, '<br>')}</code>
                        </div>
                    `;

                } catch (error) {
                    clipboardOutput.innerHTML = `
                        <p style="color: red;">❌ Ошибка при копировании: ${error.message}</p>
                        <p style="font-size: 0.9em; color: #666;">
                            Возможно, нужно разрешить доступ к буферу обмена
                        </p>
                    `;
                }
            } else {
                clipboardOutput.innerHTML = `
                    <p>Clipboard API не поддерживается вашим браузером.</p>
                    <p style="font-size: 0.9em; color: #666;">
                        ⓘ Этот API работает в Firefox 63+, Chrome 66+, Edge 79+
                    </p>
                    <div style="margin-top: 10px;">
                        <strong>Альтернатива:</strong>
                        <button onclick="fallbackCopyToClipboard()" style="margin-left: 10px; padding: 5px 10px;">
                            Скопировать старым способом
                        </button>
                    </div>
                `;
            }
        });

        window.fallbackCopyToClipboard = function() {
            const textArea = document.createElement('textarea');
            textArea.value = `Скопировано через fallback метод!\nВремя: ${new Date().toLocaleTimeString()}`;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                clipboardOutput.innerHTML = `<p style="color: green;">✅ Текст скопирован (старый метод)</p>`;
            } catch (err) {
                clipboardOutput.innerHTML = `<p style="color: red;">❌ Не удалось скопировать текст</p>`;
            }
            document.body.removeChild(textArea);
        };
    }
});
