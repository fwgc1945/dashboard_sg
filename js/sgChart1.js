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
let vals = [data1.length - 10, data1.length];
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

// スライドバー設定
let max = data1.length;

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

// チャート表示内容再設定
function chartReplace(device_sel) {

    // チャート表示用データの初期化
    labels = [];
    data1 = [];
    data2 = [];
    data3 = [];
    data4 = [];
    data5 = [];

    console.log("device_sel",device_sel);
    // console.log("labels",labels);
    // データの選択
    for (let index = 0; index < device.length; index++) {
        if (device[index] == device_sel) {
            labels.push(labels_all[index]);
            data1.push(data1_all[index]);
            data2.push(data2_all[index]);
            data3.push(data3_all[index]);
            data4.push(data4_all[index]);
            data5.push(data5_all[index]);        

            device_description = (device_description_all[index]);
        }
    }
    let max = data1.length;
    let vals = [data1.length - 10, data1.length];

    // 正しく動作しない　調査中！！！！！！！！！！！！！！
    // 正常動作確認　勘違いかな？
    $(function() {
        $('#device-description').replaceWith('<h4 id="device-description">' + device_description + '</h4>');
    });        

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

    // 全体グラフデータの再セット
    chart_obj2.data.datasets[0].data = data1;
    chart_obj2.data.datasets[1].data = data2;
    chart_obj2.data.labels = labels;

    // グラフ再表示
    chart_obj1.update();
    chart_obj2.update();

    return true;
};
