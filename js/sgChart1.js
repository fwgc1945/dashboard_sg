/* chart.jsにて水位グラフを表示
    create: 2019.04.02
    Author: DENSIN:KOORI
*/

// 全体グラフデータの設定
var config = {
    labels: labels,
    datasets: [{
        label: label1,
        backgroundColor: "rgba(151,187,205,0.6)",
        borderColor: "rgba(151,187,205,0.9)",
        hoverBackgroundColor: "rgba(64,96,255,0.75)",
        hoverBorderColor: "rgba(64,96,255,1)",
        data: data1,
        hidden: false,
        lineTension: 0.2,
        fill: false, // not filling with background color
    },
    {
        label: label2,
        backgroundColor: "rgba(240,128,128,0.6)",
        borderColor: "rgba(240,128,128,0.9)",
        hoverBackgroundColor: "rgba(255,64,64,0.75)",
        hoverBorderColor: "rgba(255,64,64,1)",
        data: data2,
        hidden: false,
        lineTension: 0.2,
        fill: false, // not filling with background color
    }
    ]
};

// スライドバー設定
let max = data1.length;
let vals = [data1.length - 10, data1.length];

$("#slider1").slider({
    max: max, //最大値
    min: 0, //最小値
    values: vals, //初期値
    step: 1, //幅
    range: true,

    slide: function (event, ui) {
    },
    create: function (event, ui) {
    },

    change: function (event, ui) {
        let vals = $("#slider1").slider("option", "values");
        console.log(vals[0], vals[1]);

        // データの再セット
        let data1_rep = data1.slice(vals[0], vals[1] + 1);
        chart_obj1.data.datasets[0].data = data1_rep;

        let data2_rep = data2.slice(vals[0], vals[1] + 1);
        chart_obj1.data.datasets[1].data = data2_rep;

        let data3_rep = data3.slice(vals[0], vals[1] + 1);
        chart_obj1.data.datasets[2].data = data3_rep;

        let data4_rep = data4.slice(vals[0], vals[1] + 1);
        chart_obj1.data.datasets[3].data = data4_rep;

        let data5_rep = data5.slice(vals[0], vals[1] + 1);
        chart_obj1.data.datasets[4].data = data5_rep;

        let labels_rep = labels.slice(vals[0], vals[1] + 1);
        chart_obj1.data.labels = labels_rep;

        if (vals[0] < vals[1]) {
            chart_obj1.update();
        }
    }
});

// 全体グラフの生成
var ctx = document.getElementById("chart2").getContext("2d");
var chart_obj2 = new Chart(ctx, {
    type: "line",
    data: config,
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    callback: function (value) {
                        return value + "";
                    }
                }
            }]
        }
    }
});

// 詳細グラフデータのセット
let data1_rep = data1.slice(vals[0], vals[1] + 1);
let data2_rep = data2.slice(vals[0], vals[1] + 1);
let data3_rep = data3.slice(vals[0], vals[1] + 1);
let data4_rep = data4.slice(vals[0], vals[1] + 1);
let data5_rep = data5.slice(vals[0], vals[1] + 1);
let labels_rep = labels.slice(vals[0], vals[1] + 1);

var config2 = {
    labels: labels_rep,
    datasets: [{

        // 計測値
        label: label1,
        backgroundColor: "rgba(151,187,205,0.6)",
        borderColor: "rgba(151,187,205,0.9)",
        hoverBackgroundColor: "rgba(64,96,255,0.75)",
        hoverBorderColor: "rgba(64,96,255,1)",
        data: data1_rep,
        hidden: false,
        lineTension: 0.2,
        fill: false, // not filling with background color
    },
    {
        // 温度
        label: label2,
        backgroundColor: "rgba(240,128,128,0.6)",
        borderColor: "rgba(240,128,128,0.9)",
        hoverBackgroundColor: "rgba(255,64,64,0.75)",
        hoverBorderColor: "rgba(255,64,64,1)",
        data: data2_rep,
        hidden: false,
        lineTension: 0.2,
        fill: false, // not filling with background color
    },
    {
        // 平常値
        label: label3,
        backgroundColor: "rgba(34,178,76,0.6)",
        borderColor: "rgba(34,178,76,0.9)",
        data: data3_rep,
        hidden: false,
        lineTension: 0.2,
        fill: false, // not filling with background color
    },
    {
        // 注意値
        label: label4,
        backgroundColor: "rgba(253,191,8,0.6)",
        borderColor: "rgba(253,191,8,0.9)",
        data: data4_rep,
        hidden: false,
        lineTension: 0.2,
        fill: false, // not filling with background color
    },
    {
        // 警報値
        label: label5,
        backgroundColor: "rgba(201,50,31,0.6)",
        borderColor: "rgba(201,50,31,0.9)",
        data: data5_rep,
        hidden: false,
        lineTension: 0.2,
        fill: false, // not filling with background color
    }
]
};

// 詳細グラフの生成
var ctx = document.getElementById("chart1").getContext("2d");
var chart_obj1 = new Chart(ctx, {
    type: "line",
    data: config2,
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    callback: function (value) {
                        return value + "";
                    }
                }
            }]
        }
    }
});

// }

