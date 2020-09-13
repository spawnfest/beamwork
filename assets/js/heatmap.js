import uPlot from 'uplot'

let chart = null;

function draw(u) {
  console.log(["draw", u])
}

function heatmapPlugin() {
  return {
    hooks: {
      draw: u => {
        console.log("getting here too");
      }
    }
  }
}

function paths(u, sidx, i0, i1) {
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

    for (let i = i0; i < i1; i++) {
        let x0 = Math.round(u.valToPos(xdata[i], scaleX, true));
        let y0 = Math.round(u.valToPos(ydata[i], scaleY, true));
        let x1 = Math.round(u.valToPos(xdata[i + 1], scaleX, true));
        let y1 = Math.round(u.valToPos(ydata[i + 1], scaleY, true));

        stroke.lineTo(x0 - x_width, y0);
        stroke.lineTo(x1 - x_width, y0);

        if (i == i1 - 1) {
            stroke.lineTo(x1 - x_width, y1);
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
}

function create_chart(raw) {
    //let rect = (document.getElementById("chart_parent").getBoundingClientRect());
    let rect = { width: window.innerWidth * 0.6, height: 400 };

    let data = raw;
    // let data = [
    //   raw[0],
    //   // raw[1].map(vals => vals[0]),
    //   // raw[1].map(vals => vals[vals.length - 1]),
    //   raw[1]
    // ];

    console.log(data)

    let opts = {
        title: "Web Request Response Time [ms]",
        id: "heatmap-chart",
        class: "my-chart",
        width: rect.width,
        height: rect.height,
        plugins: [
            heatmapPlugin()
        ],
        labelSize: 10,
        labelFont: "bold 8px Arial",
        ticks: { show: false },
        points: { show: false },
        font: "8px Arial",
        series: [
            { value: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}' },
            {
                label: "Requests",
                ke: "rgb(30, 30, 30)",
                value: (self, rawValue) => rawValue + "rpm",
                paths: () => null,
                draw: draw,
                points: {show: false}
            }
        ],
    };

    console.log(opts);

    chart = new uPlot(opts, data, document.getElementById("heatmap"));
}

export const HeatmapData = {
    mounted() {
        // mounted stuff here.
        console.log(JSON.parse(this.el.dataset.heatmap));
        create_chart(JSON.parse(this.el.dataset.heatmap));
    },
    updated() {
        chart.setData(JSON.parse(this.el.dataset.heatmap));
    }
}


// function rawData(xCount, ySeriesCount, yCountMin, yCountMax, yMin, yMax) {
//     xCount = xCount || 100;
//     ySeriesCount = ySeriesCount || 1;

//     // 50-300 samples per x
//     yCountMin = yCountMin || 200;
//     yCountMax = yCountMax || 500;

//     // y values in 0 - 1000 range
//     yMin = yMin || 5;
//     yMax = yMax || 1000;

//     let data = [
//         [],
//         ...Array(ySeriesCount).fill(null).map(_ => []),
//     ];

//     let now = Math.round(new Date() / 1e3);

//     let finalCount = 0;

//     for (let xi = 0; xi < xCount; xi++) {
//         data[0][xi] = now++;

//         for (let si = 1; si <= ySeriesCount; si++) {
//             let yCount = randInt(yCountMin, yCountMax);

//             let vals = data[si][xi] = [];

//             while (yCount-- > 0) {
//             //	vals.push(Math.round(randn_bm(yMin, yMax, 3)));
//                 vals.push(Math.max(randomSkewNormal(Math.random, 30, 30, 3), yMin));
//                 finalCount++;
//             }

//             vals.sort((a, b) => a - b);
//         }
//     }

//     console.log(finalCount);

//     return data;
// }

// function incrRound(num, incr) {
//     return Math.round(num/incr)*incr;
// }

// function incrRoundUp(num, incr) {
//     return Math.ceil(num/incr)*incr;
// }

// function incrRoundDn(num, incr) {
//     return Math.floor(num/incr)*incr;
// }

// function aggData(data, incr) {
//     let data2 = [
//         data[0],
//         [],
//         [],
//     ];

//     data[1].forEach((vals, xi) => {
//         let _aggs = [];
//         let _counts = [];

//         let _curVal = incrRoundUp(vals[0], incr);
//         let _curCount = 0;

//         vals.forEach(v => {
//             v = incrRoundUp(v, incr);

//             if (v == _curVal)
//                 _curCount++;
//             else {
//                 _aggs.push(_curVal);
//                 _counts.push(_curCount);

//                 _curVal = v;
//                 _curCount = 1;
//             }
//         });

//         _aggs.push(_curVal);
//         _counts.push(_curCount);

//         data2[1][xi] = _aggs;
//         data2[2][xi] = _counts;
//     });

//     return data2;
// }

// console.time("rawData");
// let raw = rawData();
// console.timeEnd("rawData");
// //		console.log(raw);

// let data = [
//     raw[0],
//     raw[1].map(vals => vals[0]),
//     raw[1].map(vals => vals[vals.length - 1]),
//     raw[1],
// ];

// function heatmapPlugin() {
//     return {
//         hooks: {
//             draw: u => {
//                 const { ctx, data } = u;

//                 let yData = data[3];

//                 yData.forEach((yVals, xi) => {
//                     let xPos = Math.round(u.valToPos(data[0][xi], 'x', true));

//                     yVals.forEach(yVal => {
//                         let yPos = Math.round(u.valToPos(yVal, 'y', true));
//                         ctx.fillStyle = "rgba(255,0,0,0.4)";
//                         ctx.fillRect(
//                             xPos - 4,
//                             yPos,
//                             10,
//                             1,
//                         );
//                     });
//                 });
//             }
//         }
//     };
// }

// const opts = {
//     width: 1800,
//     height: 600,
//     title: "Latency Heatmap (~20k)",
//     plugins: [
//         heatmapPlugin(),
//     ],
//     cursor: {
//         drag: {
//             y: true,
//         },
//         points: {
//             show: false
//         }
//     },
//     series: [
//         {},
//         {
//             paths: () => null,
//             points: {show: false},
//         },
//         {
//             paths: () => null,
//             points: {show: false},
//         },
//     ],
// };

// let u = new uPlot(opts, data, document.body);


// const bucketIncr = 2;

// //		console.time("aggData");
// let agg = aggData(raw, bucketIncr);
// //		console.timeEnd("aggData");
// //		console.log(agg);

// let data2 = [
//     agg[0],
//     raw[1].map(vals => vals[0]),
//     raw[1].map(vals => vals[vals.length - 1]),
//     agg[1],
//     agg[2],
// ];

// function heatmapPlugin2() {
//     // let global min/max
//     function fillStyle(count, minCount, maxCount) {
//     //	console.log(val);
//         return `hsla(${180 + count/maxCount * 180}, 80%, 50%, 1)`;
//     }

//     return {
//         hooks: {
//             draw: u => {
//                 const { ctx, data } = u;

//                 let yData = data[3];
//                 let yQtys = data[4];
// /*
//                 let maxCount = -Infinity;
//                 let minCount = Infinity;

//                 yQtys.forEach(qtys => {
//                     maxCount = Math.max(maxCount, Math.max.apply(null, qtys));
//                     minCount = Math.min(minCount, Math.min.apply(null, qtys));
//                 });

//                 console.log(maxCount, minCount);
// */

//                 // pre-calc rect height since we know the aggregation bucket
//                 let yHgt = Math.floor(u.valToPos(bucketIncr, 'y', true) - u.valToPos(0, 'y', true));

//                 yData.forEach((yVals, xi) => {
//                     let xPos = Math.floor(u.valToPos(data[0][xi], 'x', true));

//                     let maxCount = yQtys[xi].reduce((acc, val) => Math.max(val, acc), -Infinity);

//                     yVals.forEach((yVal, yi) => {
//                         let yPos =  Math.floor(u.valToPos(yVal, 'y', true));

//                     //	ctx.fillStyle = fillStyle(yQtys[xi][yi], minCount, maxCount);
//                         ctx.fillStyle = fillStyle(yQtys[xi][yi], 1, maxCount);
//                         ctx.fillRect(
//                             xPos - 4,
//                             yPos,
//                             10,
//                             yHgt,
//                         );
//                     });
//                 });
//             }
//         }
//     };
// }

// const opts2 = {
//     width: 1800,
//     height: 600,
//     title: "Latency Heatmap Aggregated 10ms (~20k)",
//     plugins: [
//         heatmapPlugin2(),
//     ],
//     cursor: {
//         drag: {
//             y: true,
//         },
//         points: {
//             show: false
//         }
//     },
//     series: [
//         {},
//         {
//             paths: () => null,
//             points: {show: false},
//         },
//         {
//             paths: () => null,
//             points: {show: false},
//         },
//     ],
// };

// let u2 = new uPlot(opts2, data2, document.body);
