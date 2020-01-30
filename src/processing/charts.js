import Chart from 'chart.js';

export function bar(el, data) {
	let wordList = ["no","yes", "maybe", "why?", "how?", "NEVER"];
	function genColors(i) {
		return new Array(i).fill(null).map(() => {
			let r = Math.floor(Math.random()*255);
			let g = Math.floor(Math.random()*255);
			let b = Math.floor(Math.random()*255);
			return (a) => {return `rgba(${r},${g},${b},${a})`;}
		})
	}
	let chart = new Chart(el, {
  	type: 'bar',
    data: {
      labels: wordList,
      datasets: [{
        borderWidth: 5
      }]
    },
    options: {
    	legend: {
    		labels: {
    			fontSize: 24
    		}
    	},
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 1.0,
            fontSize: 24	
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 24	
          }
        }]
      }
    }
	});
	setColors();
	function setColors() {
		let colors = genColors(4);
		let bg = ['rgba(255, 99, 132, 0.2)','rgba(54, 235, 162, 0.2)'].concat(colors.map((el) => el(0.5)));
		let border = ['rgba(255, 99, 132, 1)','rgba(54, 235, 162, 1)'].concat(colors.map((el) => el(1)));
		let chartData = data.concat(new Array(4).fill(null).map(() => Math.random()));
		chart.data.datasets[0].backgroundColor = bg;
		chart.data.datasets[0].borderColor = border;
		chart.data.datasets[0].data = chartData;
		chart.update();
	}
	let intervals = new Array(10);
	for(var i = 0; i < 10; i++) {
		let steps = 10;
		let stepSize = 50;
		let min = 50;
		intervals[i] = setInterval(setColors, i*(Math.floor(Math.random()*steps)*stepSize+min)+150);
	}
	return [chart, intervals]	;
}

export function line(el, data) {
	let points = 80;
	let noLine = new Array(points);
	let yesLine = new Array(points);
	noLine[0] = data[0];
	yesLine[0] = data[1];		
	for(var i = 1; i < points; i++) {
		let rand = Math.random()*0.2 - 0.1;
		noLine[i] = Math.min(Math.max(0, noLine[i-1] + rand), 1);
		yesLine[i] = 1 - noLine[i];
	}
	let chart = new Chart(el, {
  	type: 'line',
    data: {
    	labels: new Array(points).fill('hello'),
      datasets: [{
        data: noLine,
        label: "no",
        borderColor: 'rgba(255, 99, 132, 1)',
        lineTension: 0.1,
        borderWidth: 5
      },
      {
      	data: yesLine,
      	label: "yes",
        borderColor: 'rgba(54, 235, 162, 1)',
        lineTension: 0.1,
        borderWidth: 5
      }]
    },
    options: {
    	legend: {
    		labels: {
    			fontSize: 24
    		}
    	},
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 1.0,
            fontSize: 24	
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 24	
          }
        }]
      }
    }
	});
	let label = "hello";
	let interval = null;
	// make it go crazyyyyy
	setTimeout(() => {
		interval = setInterval(() => {
			label += "o"; 
			chart.data.labels = new Array(50).fill(label);
			chart.update();
		}, 50)}, 1000);
	return [chart, [interval]];
}

export function pie(el, inputData) {
	let count = 1;
	let border = ['rgba(255, 99, 132, 1)', 'rgba(54, 235, 162, 1)'];
	let bg = ['rgba(255, 99, 132, 0.9)', 'rgba(54, 235, 162, 0.9)'];
	let normal = {
		borderColor: border,
		backgroundColor: bg
	}
	let reversed = {
		borderColor: border.slice().reverse(),
		backgroundColor: bg.slice().reverse()
	}
	let amount = 80;
	let rings = new Array(amount);
	rings[0] = {
		data: inputData,
		borderWidth: 3,
		...normal
	}
	for(var i = 1; i < amount; i++) {
		let rand = Math.random()*0.2 - 0.1;
		let curr = rings[i-1].data.slice().reverse();
		curr[0] = Math.min(Math.max(0, curr[0] + rand), 1);
		curr[1] = 1 - curr[0];
		let add = i % 2 == 0 ? normal : reversed;
		rings[i] = Object.assign({data: curr, borderWidth: 3}, add);
	}
	let chart = new Chart(el, {
  	type: 'pie',
    data: {
    	labels: ['no', 'yes'],
      datasets: rings[0]
    },
    options: {
    	rotation: Math.PI,
    	legend: {
    		labels: {
    			fontSize: 24
    		}
    	},
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 1.0,
            fontSize: 24	
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 24	
          }
        }]
      }
    }
	});
	function randomize() {
		count += Math.floor(Math.random()*10)-5;
		count = Math.min(Math.max(count, 1), 79);
		let newData = rings.slice(0, count);
		chart.data.datasets = newData;
		chart.update();
	}
	let intervals = new Array(10);
	for(var i = 0; i < 10; i++) {
		let steps = 10;
		let stepSize = 50;
		let min = 50;
		intervals[i] = setInterval(randomize, i*(Math.floor(Math.random()*steps)*stepSize+min)+150);
	}
	return [chart, intervals];
}

export function bubble(el, data) {
	let points = 80;
	let count = 1;
	let noLine = new Array(points);
	let yesLine = new Array(points);
	noLine[0] = {x: 0.2, y: data[0], r: data[0]*100}
	yesLine[0] = {x: 0.8, y: data[1], r: data[1]*100}
	buildData();
	let chart = new Chart(el, {
  	type: 'bubble',
    data: {
    	labels: new Array(points).fill('hello'),
      datasets: [{
        data: [noLine[0]],
        label: "no",
        borderColor: 'rgba(255, 99, 132, 1)',
        lineTension: 0.1,
        borderWidth: 5
      },
      {
      	data: [yesLine[0]],
      	label: "yes",
        borderColor: 'rgba(54, 235, 162, 1)',
        lineTension: 0.1,
        borderWidth: 5
      }]
    },
    options: {
    	animation: {
        duration: 200,
        easing: 'easeInSine'
      },
    	legend: {
    		labels: {
    			fontSize: 24
    		}
    	},
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: 1.0,
            fontSize: 24	
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 24,
            suggestedMax: 1.0,
            suggestedMin: 0.0	
          }
        }]
      }
    }
	});
	let iter = 0;
	function randomize() {
		count += Math.floor(Math.random()*10)-4;
		count = Math.min(Math.max(count, 1), 79);
		iter++;
		if(count > 40 && iter % 10 == 0) {
			buildData();
		}
		let noData = noLine.slice(0, count);
		chart.data.datasets[0].data = noData;
		let yesData = yesLine.slice(0, count);
		chart.data.datasets[1].data = yesData;
		chart.update();
	}
	function buildData() {
		for(var i = 1; i < points; i++) {
			let range = i/points+0.2
			let rand = Math.random()*range - (range/2);
			let randTwo = Math.random()*range - (range/2);
			let no = data[0] + rand;
			let yes = data[1] + randTwo;
			noLine[i] = {x: i/points*0.8+0.2, y: no, r: no*100}
			yesLine[i] = {x: 0.8 - (i/points*0.8), y: yes, r: yes*100}
		}
	}
	let intervals = new Array(10);
	for(var i = 0; i < 10; i++) {
		let steps = 10;
		let stepSize = 50;
		let min = 50;
		intervals[i] = setInterval(randomize, i*(Math.floor(Math.random()*steps)*stepSize+min)+150);
	}
	return [chart, intervals];
}