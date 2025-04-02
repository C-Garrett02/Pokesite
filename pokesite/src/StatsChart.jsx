import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
 
function StatsChart({stats}) {

    let fontscaling = window.innerHeight/(100/1.8);

    if(stats){
      const colors = [];
        for (const stat of Object.values(stats)){
         if(stat <= 25){
          colors.push('#ba0404')
         }
         else if (stat <= 60){
          colors.push('#ed7207')
         }
         else if (stat <= 90){
          colors.push('gold')
         }
         else if (stat <= 110){
          colors.push('#8ded07')
         }
         else if (stat <= 130){
          colors.push('#44ed07')
         }
         else{
          colors.push('#06bd95')
         }
        }
        const data = {
            // Name of the variables on x-axies for each bar
            labels: [["HP", stats['hp']], ["Attack", stats['attack']], ["Defense", stats['defense']], ["Sp. Atk", stats['special-attack']], ["Sp. Def", stats['special-defense']], ["Speed", stats['speed']]],
            datasets: [
                {
                    data: [stats['hp'], stats['attack'], stats['defense'], stats['special-attack'], stats['special-defense'], stats['speed']],
                    backgroundColor: colors,
                    //borderColor: 'black',
                    //borderWidth: 2
                }
            ],
        }

        const options = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            events: [],
            scales: {
              x: {
                grid: {
                  display: false // This turns off the x-axis gridlines
                },
                max: 150,
                ticks : {
                  display: false
                },
                border: {
                  width: 0
                }
              },
              y: {
                grid: {
                  display: false // This turns off the x-axis gridlines
                },
                border: {
                  width: 0
                },
                ticks : {
                  color: '#ffffff',
                  crossAlign: "far",
                  font: {
                    size: fontscaling,
                    weight: "bold"
                  }
                }
              }
            },
            onResize: function(chart) {
              chart.options.scales.y.ticks.font.size = window.innerHeight/(100/1.8);
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        return (
                <Bar
                    //height={400}
                    className='statsChart'
                    data={data}
                    options={options}
                />
        );
    }
}
 
export default StatsChart;