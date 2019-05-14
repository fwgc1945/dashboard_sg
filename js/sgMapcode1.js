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

    // mapObjを作成
    var mapObj = new google.maps.Map(document.getElementById('map'), mapOptions);
  
    // info Windowを作成
    var infoWindow = new google.maps.InfoWindow();

    jQuery.each(latlong, function() {

        console.log('基準線:',this.reference_line, this.distance);
        var device_sel = this.device;

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

                // icon: {url:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|0099cc|",
                //     scaledSize: new google.maps.Size(25, 40),
                // },

                // icon: {url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|ff0000|",
                //     scaledSize: new google.maps.Size(25, 40)
                // },

                // icon: {url: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|ffff00|",
                //     scaledSize: new google.maps.Size(25, 40)
                // },

                // icon: {
                //     fillColor: "#FF0000",                //塗り潰し色
                //     fillOpacity: 0.8,                    //塗り潰し透過率
                //     path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, //円を指定
                //     scale: 10,                           //円のサイズ
                //     strokeColor: "#FF0000",              //枠の色
                //     strokeWeight: 1.0                    //枠の透過率
                // },

                // icon: {
                //     path: 'M -8,-8 8,8 M 8,-8 -8,8',     //座標（×）
                //     strokeColor: "#ff0000",              //線の色
                //     strokeWeight: 4.0                    //線の太
                // },

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

        // マーカークリックイベントを追加
        google.maps.event.addListener(markerObj, 'click', function(e) {

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
            // var infoWindow = new google.maps.InfoWindow();

            infoWindow.setContent(html);
            infoWindow.open(mapObj, markerObj);

            // チャート表示内容再設定
            chartReplace(device_sel);
        });
    });
});
