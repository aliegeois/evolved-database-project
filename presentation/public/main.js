onload = () => {
	const results = document.getElementById('results');

	document.getElementById('rq1').addEventListener('click', () => {
		fetch('request/1')
			.then(res => res.json())
			.then(res => {
				results.innerHTML = res.safeRate;
			});
	});

	document.getElementById('rq2').addEventListener('click', () => {
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
				results.innerHTML = '';
				results.appendChild(table);
			});
	});

	document.getElementById('rq3').addEventListener('click', () => {
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
				results.innerHTML = '';
				results.appendChild(table);
			});
	});

	document.getElementById('rq4').addEventListener('click', () => {
		fetch('request/4')
			.then(res => res.json())
			.then(res => {
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');
				new Chart(ctx, {
					type: 'line',
					data: {
						labels: res.map(e => e._id.year),
						datasets: [{
							label: 'nombre de posts',
							data: res.map(e => e.count),
							backgroundColor: 'rgba(255, 99, 132)'
						}],
						borderWidth: 1
					}
				});
				results.innerHTML = '';
				results.appendChild(canvas);
			});
	});

	document.getElementById('rq5').addEventListener('click', () => {
		fetch('request/5')
			.then(res => res.json())
			.then(res => {
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');
				let data = {},
					dataset = {};
				for(let line of res) {
					if(!data[line._id.year]) {
						data[line._id.year] = [{
							tag: line._id.tag,
							count: line.count
						}];
					} else {
						data[line._id.year].push({
							tag: line._id.tag,
							count: line.count
						});
					}
					if(!dataset[line._id.tag]) {
						dataset[line._id.tag] = [{
							year: line._id.year,
							count: line.count
						}];
					} else {
						dataset[line._id.tag].push({
							year: line._id.year,
							count: line.count
						});
					}
				}

				let colors = ['rgba(255, 99, 132)', 'rgba(54, 162, 235)', 'rgba(255, 206, 86)', 'rgba(75, 192, 192)', 'rgba(153, 102, 255)'];

				new Chart(ctx, {
					type: 'line',
					data: {
						labels: Object.keys(data),
						datasets: Object.entries(dataset).map(([ tag, arr], index) => ({
							label: tag,
							data: arr.map(line => line.count),
							backgroundColor: 'rgba(0, 0, 0, 0)',
							borderColor: colors[index]
						})),
						borderWidth: 1
					}
				});
				results.innerHTML = '';
				results.appendChild(canvas);
			});
	});
};