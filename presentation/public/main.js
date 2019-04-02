onload = () => {
	const result = document.getElementById('result');
	const description = document.getElementById('description');

	document.getElementById('rq1').addEventListener('click', () => {
		description.innerHTML = 'Proportion des tags safe/questionable/explicit :';
		fetch('request/1')
			.then(res => res.json())
			.then(res => {
				result.innerHTML = `<div>Safe: ${res.safeRate.toPrecision(4)*100}%</div>`
					+ `<div>Questionable: ${res.questionableRate.toPrecision(4)*100}%</div>`
					+ `<div>Explicit: ${res.explicitRate.toPrecision(4)*100}%</div>`;
			});
	});

	document.getElementById('rq2').addEventListener('click', () => {
		description.innerHTML = 'Les dix utilisateurs postant le plus';
		result.innerHTML = '';
		fetch('request/2')
			.then(res => res.json())
			.then(res => {
				let table = document.createElement('table'),
					thead = document.createElement('thead'),
					tr = document.createElement('tr'),
					name = document.createElement('th'),
					count = document.createElement('th');
				name.innerHTML = 'Name';
				count.innerHTML = 'Number of posts';
				tr.appendChild(name);
				tr.appendChild(count);
				thead.appendChild(tr);
				table.appendChild(thead);
				let tbody = document.createElement('tbody');
				for(let r of res) {
					let tr = document.createElement('tr'),
						name = document.createElement('td'),
						count = document.createElement('td');
					fetch(`https://danbooru.donmai.us/users/${r.id}.json`)
						.then(res => res.json())
						.then(res => {
							name.innerHTML = res.name;
						});
					count.innerHTML = r.post_upload_count;
					tr.appendChild(name);
					tr.appendChild(count);
					tbody.appendChild(tr);
				}
				table.appendChild(tbody);
				
				result.appendChild(table);
			});
	});

	document.getElementById('rq4').addEventListener('click', () => {
		description.innerHTML = 'Les dix tags sur lesquels les dix utilisateurs postent le plus';
		result.innerHTML = '';
		fetch('request/3')
			.then(res => res.json())
			.then(res => {
				let table = document.createElement('table'),
					thead = document.createElement('thead'),
					tr = document.createElement('tr'),
					name = document.createElement('th'),
					count = document.createElement('th');
				name.innerHTML = 'Name';
				count.innerHTML = 'Number of posts';
				tr.appendChild(name);
				tr.appendChild(count);
				thead.appendChild(tr);
				table.appendChild(thead);
				let tbody = document.createElement('tbody');
				for(let r of res) {
					let tr = document.createElement('tr'),
						name = document.createElement('td'),
						count = document.createElement('td');
					name.innerHTML = r.name;
					count.innerHTML = r.post_count;
					tr.appendChild(name);
					tr.appendChild(count);
					tbody.appendChild(tr);
				}
				table.appendChild(tbody);
				
				result.appendChild(table);
			});
	});

	document.getElementById('rq6').addEventListener('click', () => {
		description.innerHTML = 'Le nombre de posts pour chaque année';
		result.innerHTML = '';
		fetch('request/4')
			.then(res => res.json())
			.then(res => {
				res.pop();
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');
				new Chart(ctx, {
					type: 'line',
					data: {
						labels: res.map(e => e._id.year),
						datasets: [{
							label: 'nombre de posts',
							data: res.map(e => e.count),
							borderColor: 'rgba(255, 99, 132)'
						}]
					}
				});
				
				result.appendChild(canvas);
			});
	});

	document.getElementById('rq7').addEventListener('click', () => {
		description.innerHTML = 'L\'évolution de la popularité des dix tags les plus populaires';
		result.innerHTML = '';
		fetch('request/5')
			.then(res => res.json())
			.then(res => {
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');
				let data = {},
					dataset = {};
				for(let line of res) {
					if(line._id.year >= 2018)
						continue;
					if(!data[line._id.year]) {
						data[line._id.year] = [{
							tag: line._id.tag,
							count: line.count,
							name: line.name[0].name
						}];
					} else {
						data[line._id.year].push({
							tag: line._id.tag,
							count: line.count,
							name: line.name[0].name
						});
					}
					if(!dataset[line._id.tag]) {
						dataset[line._id.tag] = [{
							year: line._id.year,
							count: line.count,
							name: line.name[0].name
						}];
					} else {
						dataset[line._id.tag].push({
							year: line._id.year,
							count: line.count,
							name: line.name[0].name
						});
					}
				}

				let colors = ['rgba(255, 99, 132)', 'rgba(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)', 'rgba(153, 102, 255)', 'rgba(255, 99, 132)', 'rgba(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)', 'rgba(153, 102, 255)'];

				new Chart(ctx, {
					type: 'line',
					data: {
						labels: Object.keys(data),
						datasets: Object.entries(dataset).map(([ tag, arr ], index) => ({
							label: arr[index].name,
							data: arr.map(line => line.count),
							backgroundColor: 'rgba(0, 0, 0, 0)',
							borderColor: colors[index]
						}))
					}
				});
				
				result.appendChild(canvas);
			});
	});

	document.getElementById('rq5').addEventListener('click', () => {
		result.innerHTML = '';
		fetch('request/6')
			.then(res => res.json())
			.then(res => {
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');
				new Chart(ctx, {
					type: 'bar',
					data: {
						labels: res.map(e => e.name[0].name),
						datasets: [{
							label: 'nombre de posts',
							data: res.map(e => e.count),
							borderColor: 'rgba(255, 99, 132)'
						}]
					}
				});
				
				result.appendChild(canvas);
			});
	});

	document.getElementById('rq3').addEventListener('click', () => {
		result.innerHTML = '';
		fetch('request/7')
			.then(res => res.json())
			.then(res => {
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');
				new Chart(ctx, {
					type: 'bar',
					data: {
						labels: res.map(e => e._id.uploader_id),
						datasets: [{
							label: 'volume de posts',
							data: res.map(e => e.count),
							borderColor: 'rgba(255, 99, 132)'
						}]
					}
				});
				
				result.appendChild(canvas);
			});
	});
};