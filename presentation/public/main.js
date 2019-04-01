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
				results.append(table);
			});
	});
};