import uPlot from 'uplot'

let chart = null;

function create_chart(data) {
	//let rect = (document.getElementById("chart_parent").getBoundingClientRect());
	let rect = { width: document.documentElement.clientWidth * 0.6, height: 400 };

	const paths = (u, sidx, i0, i1) => {
		const s = u.series[sidx];
		const xdata = u.data[0];
		const ydata = u.data[sidx];
		const scaleX = 'x';
		const scaleY = s.scale;

		const stroke = new Path2D();

		const x_width = Math.abs((u.valToPos(xdata[0], scaleX, true) - u.valToPos(xdata[1], scaleX, true)) / 2);

		stroke.moveTo(
			Math.round(u.valToPos(xdata[0], scaleX, true)),
			Math.round(u.valToPos(ydata[0], scaleY, true))
		);

		for (let i = i0; i <= i1 - 1; i++) {
			let x0 = Math.round(u.valToPos(xdata[i], scaleX, true));
			let y0 = Math.round(u.valToPos(ydata[i], scaleY, true));
			let x1 = Math.round(u.valToPos(xdata[i + 1], scaleX, true));
			let y1 = Math.round(u.valToPos(ydata[i + 1], scaleY, true));

			x0 = x0 - x_width;
			x1 = x1 - x_width;

			stroke.lineTo(x0, y0);
			stroke.lineTo(x1, y0);

			if (i == i1 - 1) {
				stroke.lineTo(x1, y1);
			}

		}

		const fill = new Path2D(stroke);

		let minY = Math.round(u.valToPos(u.scales[scaleY].min, scaleY, true));
		let minX = Math.round(u.valToPos(u.scales[scaleX].min, scaleX, true));
		let maxX = Math.round(u.valToPos(u.scales[scaleX].max, scaleX, true));

		fill.lineTo(maxX, minY);
		fill.lineTo(minX, minY);

		return {
			stroke,
			fill,
		};
	};

	let opts = {
		title: "Phoenix Performance",
		id: "chart1",
		class: "my-chart",
		width: rect.width,
		height: rect.height,
		labelSize: 10,
		labelFont: "bold 8px Arial",
		ticks: { show: false },
		points: { show: false },
		font: "8px Arial",
		series: [
			{ value: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}' },
			{
				label: "P99",
				stroke: "rgb(155, 214, 206)",
				value: (self, rawValue) => rawValue.toFixed(3) + "ms",
				fill: "rgb(155, 214, 206, 0.5 )",
				paths: paths
			},
			{
				label: "P90",
				stroke: "rgb(79, 169, 184)",
				value: (self, rawValue) => rawValue.toFixed(3) + "ms",
				fill: "rgb(79, 169, 184, 0.5)",
				paths: paths
			},
			{
				label: "P50",
				stroke: "rgb(2, 88, 115)",
				value: (self, rawValue) => rawValue.toFixed(3) + "ms",
				fill: "rgb(2, 88, 115, 0.5)",
				paths: paths
			}
		],
	};

	chart = new uPlot(opts, data, document.getElementById("chart"));
}

export const ChartData = {
	mounted() {
		// mounted stuff here.
		create_chart(JSON.parse(this.el.dataset.quantile));
	},
	updated() {
		chart.setData(JSON.parse(this.el.dataset.quantile));
	}
}



			//function seriesBarsPlugin(opts) {
			//	const labels   = opts.labels;
			//	const barWidth = Math.round(20 * devicePixelRatio);
			//	const font     = Math.round(10 * devicePixelRatio) + "px Arial";
			//	const margin   = 0.5;

			//	function drawThings(u, sidx, i0, i1, draw) {
			//		const s       = u.series[sidx];
			//		const xdata   = u.data[0];
			//		const ydata   = u.data[sidx];
			//		const scaleX  = 'x';
			//		const scaleY  = s.scale;

			//		const totalWidth = (u.series.length - 1) * barWidth;		//.show
			//		const offs	     = (sidx-1) * barWidth;

			//		for (let i = i0; i <= i1; i++) {
			//			let x0 = Math.round(u.valToPos(xdata[i], scaleX, true));
			//			let y0 = Math.round(u.valToPos(ydata[i], scaleY, true));

			//			draw(i, x0, y0, offs, totalWidth);
			//		}
			//	}

			//	function drawBars(u, sidx, i0, i1) {
			//		const scaleY  = u.series[sidx].scale;
			//		const zeroY = Math.round(u.valToPos(0, scaleY, true));
			//		const fill = new Path2D();

			//		drawThings(u, sidx, i0, i1, (i, x0, y0, offs, totalWidth) => {
			//			fill.rect(
			//				x0 - totalWidth/2 + offs,
			//				y0,
			//				barWidth,
			//				zeroY-y0
			//			);
			//		});

			//		return {fill};
			//	}

			//	function drawPoints(u, sidx, i0, i1) {
			//		u.ctx.font = font;
			//		u.ctx.textAlign = "center";
			//		u.ctx.textBaseline = "bottom";
			//		u.ctx.fillStyle = "black";

			//		drawThings(u, sidx, i0, i1, (i, x0, y0, offs, totalWidth) => {
			//			u.ctx.fillText(
			//				u.data[sidx][i],
			//				x0 - totalWidth/2 + offs + barWidth/2,
			//				y0
			//			);
			//		});
			//	}

			//	function range(u, dataMin, dataMax) {
			//		let [min, max] = uPlot.rangeNum(0, dataMax, 0.05, true);
			//		return [0, max];
			//	}

			//	return {
			//		opts: (u, opts) => {
			//			uPlot.assign(opts, {
			//				cursor: {show: false},
			//				select: {show: false},
			//				scales: {
			//					x: {
			//						time: false,
			//						range: u => [
			//							u.data[0][0]                    - margin,
			//							u.data[0][u.data[0].length - 1] + margin,
			//						],
			//					},
			//					rend: {range},
			//					size: {range},
			//					mem:  {range},
			//					inter:{range},
			//					toggle:{range},
			//				}
			//			});

			//			uPlot.assign(opts.axes[0], {
			//				splits:     () => u.data[0],
			//				values:     () => labels(),
			//				gap:        15,
			//				size:       40,
			//				labelSize:  20,
			//				grid:       {show: false},
			//				ticks:      {show: false},
			//			});

			//			opts.series.forEach((s, i) => {
			//				if (i > 0) {
			//					uPlot.assign(s, {
			//						width: 0,
			//						paths: drawBars,
			//						points: {
			//							show: drawPoints
			//						}
			//					});
			//				}
			//			});
			//		}
			//	};
			//}

			//fetch("../bench/results.json").then(r => r.json()).then(d => {
			//	const opts = {
			//		width: 1800,
			//		height: 600,
			//		title: "Line Charts (166,650 points)",
			//		axes: [
			//			{
			//				grid: {show: false},
			//			//	rotate: -45,
			//			},
			//			{
			//				show: false,
			//			},
			//		],
			//		gutters: {
			//			x: false,
			//		},
			//		series: [
			//			{},
			//			{
			//				label: "Lib Size (KB)",
			//				fill: "#33BB55",
			//				scale: 'size',
			//			},
			//			{
			//				label:	"Render Time (ms)",
			//				fill: "#B56FAB",
			//				scale: 'rend',
			//			},
			//			{
			//				label:	"Peak Heap (MB)",
			//				fill: "#BB1133",
			//				scale: 'mem',
			//			},
			//			{
			//				label:	"Final Heap (MB)",
			//				fill: "#F79420",
			//				scale: 'mem',
			//			},
			//			{
			//				label:	"Interact 10s (ms)",
			//				fill: "#558AB5",
			//				scale: 'inter',
			//			},
			//			{
			//				label:	"Toggle 6x (ms)",
			//				fill: "#FAD55C",
			//				scale: 'toggle',
			//			},
			//		],
			//		plugins: [
			//			seriesBarsPlugin({
			//				labels: () => d.filter((lib, i) => enabled[i]).map(lib => lib[0]),
			//			}),
			//		],
			//	};

			//	const body = document.body;

			//	const enabled = Array(d.length).fill(true);

			//	function makeData() {
			//		return [
			//			d.filter((lib, i) => enabled[i]).map((lib, i) => i+1),
			//			d.filter((lib, i) => enabled[i]).map(lib => lib[1]),
			//			d.filter((lib, i) => enabled[i]).map(lib => lib[3].reduce((total, num) => total + num, 0)),
			//			d.filter((lib, i) => enabled[i]).map(lib => lib[4][0]),
			//			d.filter((lib, i) => enabled[i]).map(lib => lib[4][1]),
			//			d.filter((lib, i) => enabled[i]).map(lib => lib[5] && lib[5].reduce((total, num) => total + num, 0)),
			//			d.filter((lib, i) => enabled[i]).map(lib => lib[6] && lib[6].reduce((total, num) => total + num, 0)),
			//		];
			//	}

			//	let u = new uPlot(opts, makeData(), document.body);

			//	d.forEach((lib, i) => {
			//		let btn = document.createElement("button");
			//		btn.textContent = lib[0];

			//		btn.onclick = e => {
			//			enabled[i] = !enabled[i];
			//			btn.classList.toggle("hide");
			//			u.setData(makeData());
			//		};

			//		body.appendChild(btn);
			//	});
			//});

