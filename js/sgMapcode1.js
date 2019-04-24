/* googleMapAPIにて地図を表示しています。
    create: 2019.04.02
    Author: DENSIN:KOORI

    google.maps.event.addDomListenerにてマーカーを表示
    google.maps.event.addListenerにてマーカークリックイベントを追加
 */

google.maps.event.addDomListener(window, 'load', function() {
    var lat = 34.105946;
    var lng = 134.581247;
   
    var latlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 10,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
    };
    var mapObj = new google.maps.Map(document.getElementById('map'), mapOptions);


    jQuery.each(latlong, function() {

        console.log('基準線:',this.reference_line, this.distance);

        // 基準線－計測値を水位とします。
        var waterLevel = this.reference_line - this.distance;
        var create_time = this.create_time; 
        var latlng = new google.maps.LatLng(this.lat, this.long);
        var description = this.description;
        var subDescription = this.sub_description;
        var normally_level = this.normally_level;
        var attention_level = this.attention_level;
        var alert_level = this.alert_level;
        var picture = this.picture;
        var markerObj;

        // 水位に応じてマーカー色を設定
        // 平常時
        if (waterLevel <= normally_level) {
            markerObj = new google.maps.Marker({
                position: latlng,
                map: mapObj,
                animation: google.maps.Animation.DROP,    
                icon: {url:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|00ff00|",
                       scaledSize: new google.maps.Size(25, 40),
                },    
                title: description,
                label: {
                    // color: '#0044aa',
                    color: '#0000ff',
                    fontFamily: 'sans-serif',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    text: String(waterLevel+'cm')
                }
            });
                
        };

        // 注意値
        if (waterLevel >= attention_level) {
            markerObj = new google.maps.Marker({
                position: latlng,
                map: mapObj,
                animation: google.maps.Animation.DROP,    
                icon: {url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|ffff00|",
                        scaledSize: new google.maps.Size(25, 40)
                },    
                title: description,
                label: {
                    // color: '#0044aa',
                    color: '#0000ff',
                    fontFamily: 'sans-serif',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    text: String(waterLevel+'cm')
                }
            });                   
        }; 

        // 警報値
        if (waterLevel >= alert_level) {
            markerObj = new google.maps.Marker({
                position: latlng,
                map: mapObj,
                animation: google.maps.Animation.DROP,    
                icon: {url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|ff0000|",
                        scaledSize: new google.maps.Size(25, 40)
                },    
                title: description,
                label: {
                    // color: '#0044aa',
                    color: '#0000ff',
                    fontFamily: 'sans-serif',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    text: String(waterLevel+'cm')
                }
            });                   
        }; 

        // markerObj = new google.maps.Marker({
        //     position: latlng,
        //     map: mapObj,
        //     animation: google.maps.Animation.BOUNCE,

        //     icon: {url:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|0099cc|",
        //            scaledSize: new google.maps.Size(25, 40),
        //     },

        //     icon: {url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|ff0000|",
        //            scaledSize: new google.maps.Size(25, 40)
        //     },

        //     icon: {url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|ffff00|",
        //            scaledSize: new google.maps.Size(25, 40)
        //     },

        //     // icon: {
        //     //     fillColor: "#FF0000",                //塗り潰し色
        //     //     fillOpacity: 0.8,                    //塗り潰し透過率
        //     //     path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, //円を指定
        //     //     scale: 10,                           //円のサイズ
        //     //     strokeColor: "#FF0000",              //枠の色
        //     //     strokeWeight: 1.0                    //枠の透過率
        //     // },

        //     // icon: {
        //     //     path: 'M -8,-8 8,8 M 8,-8 -8,8',     //座標（×）
        //     //     strokeColor: "#ff0000",              //線の色
        //     //     strokeWeight: 4.0                    //線の太
        //     // },

        //     title: description,
        //     label: {
        //         // color: '#0044aa',
        //         color: '#0000ff',
        //         fontFamily: 'sans-serif',
        //         fontSize: '40px',
        //         fontWeight: 'bold',
        //         text: String(waterLevel+'cm')
        //     }
        // });

        // マーカークリックイベントを追加
        google.maps.event.addListener(markerObj, 'click', function() {

            // Html文字列を作成
            html = "";
            html += '<style type="text/css">';
            html += 'p {font-size: 14px; font-family: sans-serif}';
            html += 'a {font-size: 14px; font-family: sans-serif}';
            html += '</style>';
            html += '<p><img src="images/' + picture + '" width= 100px alt=""></img>';
            // html += '<br><a href="chart-sigfox.php" target="_blank">' + ' ' + description + '</a>';
            // html += '<br><a href="chart-sigfox.php?device=75B58B">' + ' ' + description + '</a>';
            html += '<br>' + description;
            html += '<br>' + subDescription;
            html += '<br>' + "最終更新日:" + create_time;
            html += '<br>' + "　平常時:" + normally_level;
            html += '<br>' + "　注意レベル:" + attention_level;
            html += '<br>' + "　警報レベル:" + alert_level + '</p>';

            // info Windowを作成
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(html);
            infoWindow.open(mapObj, markerObj);

            // チャート表示用データの初期化
            labels = [];
            data1 = [];
            data2 = [];
            data3 = [];
            data4 = [];
            data5 = [];

            console.log("labels",labels)
            // データの選択
            for (let index = 0; index < device.length; index++) {
                if (device[index] = device_sel) {
                    labels.push(labels_all[index]);
                    data1.push(data1_all[index]);
                    data2.push(data2_all[index]);
                    data3.push(data3_all[index]);
                    data4.push(data4_all[index]);
                    data5.push(data5_all[index]);        
                }
            }

            let vals = $("#slider1").slider("option", "values");
            console.log(vals[0], vals[1]);

            // 詳細グラフデータの再セット
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

            // 全体グラフデータの再セット
            chart_obj2.data.datasets[0].data = data1;
            chart_obj2.data.datasets[1].data = data2;
            chart_obj2.data.labels = labels;

            // グラフ再表示
            chart_obj1.update();
            chart_obj2.update();

        })
    });
});
