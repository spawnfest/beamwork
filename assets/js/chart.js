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
		title: "Web Request Response Time [ms]",
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
