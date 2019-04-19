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
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true
    };
    var mapObj = new google.maps.Map(document.getElementById('map'), mapOptions);

    jQuery.each(latlong, function() {

        // 平常時－計測値を水位とします。
        var waterLevel = this.normally - this.distance;
        var latlng = new google.maps.LatLng(this.lat, this.long);
        var description = this.description;
        var subDescription = this.sub_description;
        var attention_level = this.attention_level;
        var alert_level = this.alert_level;
        var picture = this.picture;
        var markerObj;

        console.log(description);

        // 水位の応じて文字色を設定
        markerObj = new google.maps.Marker({
            position: latlng,
            map: mapObj,
            label: {
                // color: '#0044aa',
                color: '#ffffff',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                text: String(waterLevel)
            }
        });

        // マーカークリックイベントを追加
        google.maps.event.addListener(markerObj, 'click', function() {

            // Html文字列を作成
            html = "";
            html += '<style type="text/css">';
            html += 'p {font-size: 14px; font-family: sans-serif}';
            html += 'a {font-size: 14px; font-family: sans-serif}';
            html += '</style>';
            html += '<p><img src="images/' + picture + '" width= 100px alt=""></img>';
            html += '<br><a href="" target="_blank">' + ' ' + description + '</a>';
            html += '<br>' + subDescription + '</p>';

            // info Windowを作成
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(html);
            infoWindow.open(mapObj, markerObj);
        })
    });
});
