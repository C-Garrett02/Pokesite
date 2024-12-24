import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
 
function StatsChart({stats}) {

    if(stats){
        const data = {
            // Name of the variables on x-axies for each bar
            labels: ["HP " + stats['hp'], "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"],
            datasets: [
                {
                    // Data or value of your each variable
                    data: [stats['hp'], stats['attack'], stats['defense'], stats['special-attack'], stats['special-defense'], stats['speed']],
                    // Color of each bar
                    //backgroundColor: 
                    //    ["aqua", "green", "red", "yellow"],
                    // Border color of each bar
                    //borderColor: ["aqua", "green", "red", "yellow"],
                    //borderWidth: 0.5,
                },
            ],
        }

        const options = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false // This turns off the x-axis gridlines
                },
              },
              y: {
                grid: {
                  display: false // This turns off the x-axis gridlines
                },
              },
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        return (
            <div>
                <Bar
                    //height={400}
                    className='statsChart'
                    data={data}
                    options={options}
                />
            </div>
        );
    }
}
 
export default StatsChart;