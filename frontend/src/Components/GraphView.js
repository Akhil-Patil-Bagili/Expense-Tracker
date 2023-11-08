import React, { useEffect, useRef, useState } from "react";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import "../Styles/App.css";

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

const GraphView = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [error, setError] = useState(null);

    const chartRef = useRef(null);
    const myChartRef = useRef(null);

    const groupByMonth = (arr) => arr.reduce((acc, item) => {
        const date = new Date(item.date);
        const month = date.getMonth();
        acc[month] = (acc[month] || 0) + parseFloat(item.amount);
        return acc;
    }, {});

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

                const expensesData = await expensesResponse.json();
                const incomesData = await incomesResponse.json();

                if (!expensesResponse.ok || !incomesResponse.ok) {
                    throw new Error("Failed to fetch data.");
                }

                setExpenses(expensesData.results);
                setIncomes(incomesData.results);
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!expenses.length && !incomes.length) return;

        const monthlyExpenses = groupByMonth(expenses);
        const monthlyIncomes = groupByMonth(incomes);

        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const expensesData = labels.map((_, index) => monthlyExpenses[index] || 0);
        const incomesData = labels.map((_, index) => monthlyIncomes[index] || 0);

        const maxYValue = Math.max(...expensesData, ...incomesData);
        const maxRoundedYValue = Math.ceil(maxYValue / 5000) * 5000;

        if (chartRef.current && myChartRef.current) {
            const { datasets } = myChartRef.current.data;
            datasets[0].data = expensesData;
            datasets[1].data = incomesData;

            myChartRef.current.update();
        } else {
            const ctx = chartRef.current.getContext("2d");
            myChartRef.current = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Expenses",
                            data: expensesData,
                            backgroundColor: "rgba(255, 99, 132, 0.8)",
                            borderColor: "rgba(255, 99, 132, 1)",
                            borderWidth: 1,
                        },
                        {
                            label: "Incomes",
                            data: incomesData,
                            backgroundColor: "rgba(75, 192, 192, 0.8)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        }
                    ],
                },
                options: {
                    scales: {
                        x: {
                            ticks: {
                                font: { size: 10 },
                            },
                            barThickness: 30,
                        },
                        y: {
                            ticks: {
                                beginAtZero: true,
                                font: { size: 10 },
                                stepSize: Math.round(maxRoundedYValue / 10),
                                min: 0,
                                max: maxRoundedYValue
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            labels: {
                                font: { size: 10 }
                            },
                        },
                        tooltip: {
                            titleFont: { size: 12 },
                            bodyFont: { size: 10 }
                        },
                    },
                },
            });
        }
    }, [expenses, incomes]);

    return (
        <div className="chart-view">
            {error && <p className="error-message">{error}</p>}
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default GraphView;
