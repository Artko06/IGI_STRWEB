document.addEventListener('DOMContentLoaded', function () {
    const generateChartButton = document.getElementById('generate-chart');
    const saveChartButton = document.getElementById('save-chart');
    const xInput = document.getElementById('x-input');
    const epsInput = document.getElementById('eps-input');
    const ctx = document.getElementById('function-chart').getContext('2d');
    let functionChart;

    function calculateSeries(x, eps) {
        const MAX_ITERATIONS = 500;
        let fx = 1;
        let term = 1;
        let n = 0;
        const data = [{x: n, y: fx}];

        while (n < MAX_ITERATIONS && Math.abs(term) > eps) {
            n++;
            term *= x;
            fx += term;
            data.push({x: n, y: fx});
        }
        return data;
    }

    function generateChart() {
        const x = parseFloat(xInput.value);
        const eps = parseFloat(epsInput.value);

        if (Math.abs(x) >= 1) {
            alert('Значение X должно быть в диапазоне (-1, 1).');
            return;
        }
        if (eps <= 0 || eps >= 1) {
            alert('Значение Epsilon должно быть в диапазоне (0, 1).');
            return;
        }

        const seriesData = calculateSeries(x, eps);
        const mathValue = 1 / (1 - x);
        const mathData = seriesData.map(d => ({x: d.x, y: mathValue}));

        if (functionChart) {
            functionChart.destroy();
        }

        functionChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'F(x) - Ряд',
                        data: seriesData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Math F(x) - Точное значение',
                        data: mathData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'n (Количество членов ряда)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Значение функции'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: `Разложение функции 1 / (1 - x) в ряд при x = ${x}`
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: mathValue,
                                yMax: mathValue,
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 2,
                                label: {
                                    content: `Точное значение: ${mathValue.toFixed(4)}`,
                                    enabled: true,
                                    position: 'end'
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    function saveChart() {
        if (functionChart) {
            const link = document.createElement('a');
            link.href = functionChart.toBase64Image();
            link.download = 'function-chart.png';
            link.click();
        } else {
            alert('Сначала постройте график.');
        }
    }

    generateChartButton.addEventListener('click', generateChart);
    saveChartButton.addEventListener('click', saveChart);

    generateChart();
});
