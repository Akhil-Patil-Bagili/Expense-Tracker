import React, { useEffect, useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import "../Styles/App.css";

ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

const GraphView = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [error, setError] = useState(null);

    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
            };

            try {
                const [expensesResponse, incomesResponse] = await Promise.all([
                    fetch(`${process.env.REACT_APP_API_URL}/api/expenses/`, { headers }),
                    fetch(`${process.env.REACT_APP_API_URL}/api/incomes/`, { headers })
                ]);

                if (!expensesResponse.ok || !incomesResponse.ok) {
                    throw new Error("Failed to fetch data.");
                }

                const expensesData = await expensesResponse.json();
                const incomesData = await incomesResponse.json();

                setExpenses(expensesData.results);
                setIncomes(incomesData.results);

                const allDates = [...expensesData.results, ...incomesData.results].map(data => data.date);
                const years = Array.from(new Set(allDates.map(date => new Date(date).getFullYear()))).sort();
                setAvailableYears(years);
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err.message);
            }
        };

        fetchData();
    }, []);

    

    const groupByMonth = (arr, year) => {
        return arr
            .filter(item => {
                const [itemYear, , ] = item.date.split('-').map(Number);
                return itemYear === year;
            })
            .reduce((acc, item) => {
                const [year, month, day] = item.date.split('-').map(Number);
                const date = new Date(Date.UTC(year, month - 1, day));
                const monthIndex = date.getUTCMonth();
                acc[monthIndex] = (acc[monthIndex] || 0) + parseFloat(item.amount);
                return acc;
            }, {});
    };

    useEffect(() => {
        if (!expenses.length && !incomes.length) return;

        const monthlyExpenses = groupByMonth(expenses, selectedYear);
        const monthlyIncomes = groupByMonth(incomes, selectedYear);

        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const expensesData = labels.map((_, index) => monthlyExpenses[index] || 0);
        const incomesData = labels.map((_, index) => monthlyIncomes[index] || 0);

        const maxYValue = Math.max(...expensesData, ...incomesData);
        const maxRoundedYValue = Math.ceil(maxYValue / 5000) * 5000;

        const ctx = chartRef.current.getContext("2d");
        const myChart = new ChartJS(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Expenses",
                        data: expensesData,
                        backgroundColor: "rgba(255, 99, 132, 0.8)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(255, 99, 132, 1)",
                    },
                    {
                        label: "Incomes",
                        data: incomesData,
                        backgroundColor: "rgba(75, 192, 192, 0.8)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(75, 192, 192, 1)",
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        barThickness: 30,
                    },
                    y: {
                        beginAtZero: true,
                        stepSize: maxRoundedYValue / 10,
                        max: maxRoundedYValue
                    },
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12,
                                weight: 'bold',
                            }
                        }
                    },
                    tooltip: {
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 12 },
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleMarginBottom: 10,
                        xPadding: 20,
                        yPadding: 20,
                        cornerRadius: 3,
                        displayColors: false,
                    },
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutBounce',
                },
            },
        });
        

        return () => {
            myChart.destroy(); 
        };
    }, [expenses, incomes, selectedYear]);

    return (
        <div className="chart-view">
            {error && <p className="error-message">{error}</p>}
            <div>
                <label htmlFor="year-select">Select Year: </label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                >
                    {availableYears.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <canvas ref={chartRef} />
        </div>
    );
};

export default GraphView;
