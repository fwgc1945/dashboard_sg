<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>

<?php
$dsn = 'mysql:host=mysql1013.db.sakura.ne.jp;dbname=fwgc1945_densin;charset=utf8';
$user = 'fwgc1945';
$password = 'f3VWcbpbvrqdMaE';

try {
    $db = new PDO($dsn, $user, $password);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    // $stmt = $db->prepare("
    // select 
    //     t.device
    //     ,t.temp
    // from 
    //     sigfox_db t
    // group by
    //     t.device
    // ");

    $stmt = $db->prepare("
        select
        t.device
        , max(t.temp) as temp
        , max(t.volt) as volt
        , max(t.distance) as distance
        , max(t.create_time) as create_time
        , max(m.description) as description
        , max(m.sub_description) as sub_description
        , max(m.lat) as lat
        , max(m.long) as _long
        , max(m.reference_line) as reference_line
        , max(m.normally_level) as normally_level
        , max(m.attention_level) as attention_level
        , max(m.alert_level) as alert_level
        , max(m.picture) as picture
    from
        sigfox_db t 
        left join sigfox_device m 
        on t.device = m.device
    group by
        t.device
    ");

    // $stmt->bindParam(':course_id', $course_id, PDO::PARAM_INT);
    $stmt->execute();
    $data = array();
    $count = $stmt->rowCount();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $data[] = $row;
    }
    echo $data;
} catch (PDOException $e) {
    die('エラー:' . $e->getMesssage());
}


foreach ($data as $row) {
    // echo '<div class="col-sm-3 sensor-frame' . ' divice-name' .'">';
    //echo '<div class="col-sm-3 sensor-frame">';
    // echo '<div id="device-' . $row['device'] . '" class="col-sm-3 sensor-frame">'; 
    echo $row['device'];
}
?>
<hi id="test" aaaaaa> 
</div>


</body> 
</html>