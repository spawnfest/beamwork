import uPlot from 'uplot'

function create_chart(data) {
    let rect = (document.getElementById("chart_parent").getBoundingClientRect());
    console.log(rect)
    let opts = {
        title: "My Chart",
        id: "chart1",
        class: "my-chart",
        width: rect.width,
        height: rect.height,
        labelSize: 10,
        labelFont: "bold 8px Arial",
        font: "8px Arial",
        series: [
            { value: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}' },
            {
                label: "P50",
                stroke: "red",
                value: (self, rawValue) => rawValue.toFixed(1) + "ms",
            },
            {
                label: "P90",
                stroke: "blue",
                value: (self, rawValue) => rawValue.toFixed(1) + "ms",
            },
            {
                label: "P99",
                stroke: "green",
                value: (self, rawValue) => rawValue.toFixed(2) + "ms",
            }
        ],
    };

    new uPlot(opts, data, document.getElementById("chart"));
}

export const ChartData = {
    mounted() {
        // mounted stuff here.
        create_chart(JSON.parse(this.el.dataset.quantile));
    },
    updated() {
        create_chart(JSON.parse(this.el.dataset.quantile));
    }
}
