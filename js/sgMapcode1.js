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

            // 以下、検証中
            // ラベル付きマーカのオブジェクトを作成してマップに表示する
            //     markerObj = new LabeledMarker(mapObj, {
            //     position: latlng,
            //     draggable: true,
            //     animation: google.maps.Animation.DROP,    
            //     icon: {url:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|00ff00|",
            //            scaledSize: new google.maps.Size(25, 40),
            //     }    
            // }, {
            //     text: String(waterLevel+'cm'),
            //     style: {
            //         backgroundColor: 'white',
            //         borderStyle: 'solid',
            //         borderWidth: '1px',
            //     }
            // });

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
            html += '<br>' + "　警報レベル:" + alert_level;
            html += '<br>' + "　注意レベル:" + attention_level;
            html += '<br>' + "　平常時:" + normally_level + '</p>';

            // info Windowを作成
            // var infoWindow = new google.maps.InfoWindow();

            infoWindow.setContent(html);
            infoWindow.open(mapObj, markerObj);

            // チャート表示内容再設定
            chartReplace(device_sel);
        });
    });
});


// 以下、検証中
function LabeledMarker(map, markerOptions, labelOptions) {
    this.setMap(map);
    this.setPosition(markerOptions.position);

    // MarkerとLabel(Overlay)を作成する
    this.marker = this.createMarker(markerOptions);
    this.label = this.createLabel(labelOptions);
}
LabeledMarker.prototype = new google.maps.MVCObject();
LabeledMarker.prototype.setMap = function (map) {
    this.set('map', map);
};
LabeledMarker.prototype.setPosition = function (position) {
    this.set('position', position);
};
LabeledMarker.prototype.createMarker = function (markerOptions) {
    var marker = new google.maps.Marker(markerOptions);
    marker.parent = this;
    marker.bindTo('map', this);
    marker.bindTo('position', this);
    google.maps.event.addListener(marker, 'dragend', function () {
        google.maps.event.trigger(this.parent, 'dragend');
    });

    marker.addListener( "click", function ( argument ) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") ;
    } ) ;




    return marker;
};
LabeledMarker.prototype.createLabel = function (labelOptions) {
    var label = new google.maps.OverlayView();
    label.parent = this;
    label.bindTo('map', this);
    label.bindTo('position', this);
    label.onAdd = function () {
        var el = document.createElement('div');
        el.style.borderStyle = labelOptions.style.borderStyle || 'none';
        el.style.borderWidth = labelOptions.style.borderWidth || '0px';
        el.style.backgroundColor = labelOptions.style.backgroundColor || '';
        el.style.position = labelOptions.style.position || 'absolute';
        el.style.zIndex = labelOptions.style.zIndex || 100;
        
        el.style.fontSize = labelOptions.style.fontSize || '40px';
        el.style.fontWeight = labelOptions.style.fontWeight || 'bold';
        el.style.color = labelOptions.style.color || '#0000ff';
        // el.style.marginBottom = labelOptions.style.marginBottom || '100px';


        el.innerHTML = labelOptions.innerHTML || '<div>' + labelOptions.text + '</div>';
        this.el = el;
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(el);
    }
    label.draw = function () {
        if (!this.el) return;

        var overlayProjection = this.getProjection();
        var position = this.get('position');
        var xy = overlayProjection.fromLatLngToDivPixel(position);

        var el = this.el;
        el.style.left = xy.x + 'px';
        el.style.top = xy.y + 'px';
    };
    label.onRemove = function () {
        this.el.parentNode.removeChild(this.el);
        this.el = null;
    };
    label.position_changed = function () {
        this.draw(); // 親コンポーネントのポジションが変更されたら連動してラベルの表示位置を更新する
    };
    return label;
}

var position = new google.maps.LatLng({
    lat: -34.397,
    lng: 150.644
});
var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: position,
    scrollwheel: false,
    zoom: 8
});

// ラベル付きマーカのオブジェクトを作成してマップに表示する
var labeldMarker = new LabeledMarker(map, {
    position: position,
    draggable: true
}, {
    text: 'Label text',
    style: {
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: '1px',
    }
});
// labeldMarker.addListener('position_changed', function () {
//     // ドラッグによる位置変更をハンドリング
//     console.log(JSON.stringify(this.get('position')));
// });