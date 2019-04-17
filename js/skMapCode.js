/* googleMapAPIにて地図を表示しています。

    google.maps.event.addDomListenerにてマーカーを表示
 */

// マップオブジェクト作成
var mapObj = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    scrollwheel: false,
    // scrollwheel: true,
    scaleControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

google.maps.event.addDomListener(window, 'load', function () {

    // マーカー情報を更新
    jQuery.each(latlong, function () {
        var sensors_value = this.sensors_value;
        var latlng = new google.maps.LatLng(this.latitude, this.longitude);
        var description = this.description;
        var subDescription = this.sub_description;
        var picture = this.picture;
        var url = this.url;
        var markerObj;

        console.log(url);

        markerObj = new google.maps.Marker({
            position: latlng,
            map: mapObj,
            label: {
                // color: '#0044aa',
                color: '#ffffff',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                text: String(sensors_value)
            }
        });

        // マーカークリックイベントを追加
        google.maps.event.addListener(markerObj, 'click', function () {

            // Html文字列を作成
            html = "";
            html += '<style type="text/css">';
            html +='p {font-size: 12px; font-family: sans-serif}';
            html +='a {font-size: 12px; font-family: sans-serif}';
            html += '</style>';
            html += '<p><img src="images/route/' + picture + '" width= 100px alt=""></img>';
            html += '<br><a href="' + url + '" target="_blank">' + ' ' + description + '</a>';
            html += '<br>' + subDescription + '</p>';

            // info Windowを作成
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(html);
            infoWindow.open(mapObj, markerObj);
        })
    });

});
