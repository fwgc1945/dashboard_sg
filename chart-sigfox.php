<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>sigfox水位計ダッシュボード</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
        integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">

    <script src="http://maps.google.com/maps/api/js?v=3&sensor=false&key=AIzaSyBr21j2fw7PjrfdQyGU_4WFLZNqWWACmMo"
        type="text/javascript" charset="UTF-8"></script>

    <!-- <script src="js/markerwithlabel.js"> </script> -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js"></script>

    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    <!-- アイコン -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.9.0/feather.min.js"></script>

    <!-- cssファイルの設定 -->
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <?php
    $dsn = 'mysql:host=localhost;dbname=fwgc1945_densin;charset=utf8';
    $user = 'root';
    $password = '';

    // $dsn = 'mysql:host=mysql1013.db.sakura.ne.jp;dbname=fwgc1945_densin;charset=utf8';
    // $user = 'fwgc1945';
    // $password = 'f3VWcbpbvrqdMaE';

?>
    <script>
    //googleMap用データの取得
    <?php
    try {
        $db = new PDO($dsn, $user, $password);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $stmt = $db->prepare("
            select
            t.device
            , t.temp
            , t.volt
            , t.distance
            , t.create_time
            , m.description
            , m.sub_description
            , m.lat
            , m.long
            , m.reference_line
            , m.normally_level
            , m.attention_level
            , m.alert_level
            , m.picture 
          from
            sigfox_db t 
            left join sigfox_device m 
              on t.device = m.device 
          where
            id IN (select max(id) from sigfox_db group by device)
        ");

        // $stmt->bindParam(':course_id', $course_id, PDO::PARAM_INT);
        $stmt->execute();
        $data = array();
        $count = $stmt->rowCount();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
    } catch (PDOException $e) {
        die('エラー:' . $e->getMesssage());
    }
    ?>

    // device地点を設定
    var latlong = [
        <?php
            $count = count($data);
            $i = 0;
            foreach ($data as $row) {
                $i++;
                echo '{';
                echo 'device:"' . $row['device'] . '",';
                echo 'temp:' . $row['temp'] . ',';
                echo 'volt:' . $row['volt'] . ',';
                echo 'distance:' . $row['distance'] . ',';
                echo 'create_time:"' . $row['create_time'] . '",';
                echo 'description:"' . $row['description'] . '",';
                echo 'sub_description:"' . $row['sub_description'] . '",';
                echo 'lat:"' . $row['lat'] . '",';
                echo 'long:"' . $row['long'] . '",';
                echo 'reference_line:' . $row['reference_line'] . ',';
                echo 'normally_level:' . $row['normally_level'] . ',';
                echo 'attention_level:' . $row['attention_level'] . ',';
                echo 'alert_level:' . $row['alert_level'] . ',';
                echo 'picture:"' . $row['picture'] . '"';
                if ($i == $count) {
                    echo '}';
                } else {
                    echo '},';
                }
            }
            ?>
    ];
    </script>

    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">ユーザー名</a>
        <input class="form-control form-control-dark w-100" type="text" placeholder="検索" aria-label="検索">
        <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
                <a class="nav-link" href="#">サインアウト</a>
            </li>
        </ul>
    </nav>

    <div class="container-fluid">
        <div class="row">
            <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                <div class="sidebar-sticky">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">
                                <span data-feather="home"></span>
                                水位計ダッシュボード <span class="sr-only">(現位置)</span>
                            </a>
                        </li>
                        <!-- <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="bar-chart-2"></span>
                                棒グラフ
                            </a>
                        </li> -->
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <span data-feather="activity"></span>
                                折れ線グラフ
                            </a>
                        </li>
                    </ul>

                    <h6
                        class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>対象データ</span>
                        <!-- <h6>対象データ</h6> -->
                        <!-- <a class="d-flex align-items-center text-muted" href="#">
                            <span data-feather="plus-circle"></span>
                        </a> -->
                    </h6>
                    <ul class="nav flex-column mb-2">
                        <li class="nav-item">
                            <a class="nav-link" href="chart-sigfox.php?select=latest">
                                <span data-feather="file-text"></span>
                                最新（7日間）
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="chart-sigfox.php?select=thisMonth">
                                <span data-feather="file-text"></span>
                                当月
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="chart-sigfox.php?select=lastMonth">
                                <span data-feather="file-text"></span>
                                前月
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="chart-sigfox.php?select=thisYear">
                                <span data-feather="file-text"></span>
                                当年
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="chart-sigfox.php?select=lastYear">
                                <span data-feather="file-text"></span>
                                前年
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
                <div
                    class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h1"></h1>
                    <div class="btn-toolbar mb-2 mb-md-0">

                        <div class="btn-group mr-2">
                            <!-- <button type="button" class="btn btn-sm btn-outline-secondary">　活動タグ MAP　</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">　活動タグ 一覧　</button> -->
                            <button type="button" id="sensor-map" class="btn btn-sm btn-outline-secondary">　水位センサー
                                MAP　</button>
                            <button type="button" id="sensor-list" class="btn btn-sm btn-outline-secondary">　水位センサー
                                一覧　</button>
                        </div>

                        <!-- <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                            <span data-feather="calendar"></span>
                            今週
                        </button> -->
                    </div>
                </div>

                <div class="container sensor-list">
                    <h1 class="h2">センサー 一覧</h1>
                    <div class="row">
                        <?php
                        foreach ($data as $row) {
                            // echo '<div class="col-sm-3 sensor-frame' . ' divice-name' .'">';
                            //echo '<div class="col-sm-3 sensor-frame">';
                            echo '<div id="device-' . $row['device'] . '" class="col-sm-3 sensor-frame">';

                            // 基準線－計測値を水位とします。
                            $waterLevel = $row['reference_line'] - $row['distance'];

                            echo '<h5>' . $waterLevel . 'cm</h5>';
                            echo '<h5 class="h5">' . $row['description'] . '<br>' . $row['sub_description'] . '</h5>';
                            echo '<dl>';                            
                            echo '<dt>最終更新日</dt>';
                            echo '<dd>' . $row['create_time'] . '</dd>';
                            echo '<dt>警報レベル</dt>';
                            echo '<dd>' . $row['alert_level'] . ' cm</dd>';
                            echo '<dt>注意レベル</dt>';
                            echo '<dd>' . $row['attention_level'] . ' cm</dd>';
                            echo '<dt>平常時</dt>';
                            echo '<dd>' . $row['normally_level'] . ' cm</dd>';
                            echo '</dl>';                           
                            echo '</div>';
                        }
                        ?>
                    </div>
                </div>

                <h1 class="h2">センサー MAP</h1>
                <div class="row">
                    <div id="map" style="height:360px;margin-bottom: 20px;" class="col-sm-11">> </div>
                    <!-- <div id="map" class="col-sm-11">> </div> -->
                    <!-- <div id="map-canvas" style="height:360px;margin-bottom: 20px;" class="col-sm-11">> </div> -->

                    <div class="col-sm-12">
                        <h4 id="device-description"> 設置場所説明 </h4>
                    </div>
                    <div class="col-sm-11">
                        <canvas id="chart1" height="60px"></canvas>
                    </div>
                    <div class="col-sm-11">
                        <canvas id="chart2" height="50px"></canvas>
                    </div>
                    <div class="col-sm-11">
                        <div id="slider1"></div>
                    </div>
                </div>

            </main>
        </div>
    </div>

    <hr>

    <div class="container">
        <footer>
            <p>
                &copy; 2019 DENSIN
            </p>
        </footer>
    </div>

    <script>
    $(function() {
        $('#sensor-map').click(function() {
            $('.sensor-list').fadeOut();
        });
    })
    $(function() {
        $('#sensor-list').click(function() {
            $('.sensor-list').fadeIn();
        });
    })

    //センサー一覧のクリックイベント設定    
    <?php
    foreach ($data as $row) {
        echo "var clickElement = document.getElementById('device-" . $row['device']. "');";
        echo "clickElement.addEventListener('click', function(event) {";
        //クリック時のイベントを記述
        echo "device_sel = '". $row['device'] ."';";
        
        // チャート表示内容再設定
        echo "chartReplace(device_sel);";
        
        echo "},false);";
    }
    ?>

    let labels = [];
    let labels_all = [];
    let device = [];

    // 初期表示用
    let device_sel = '75B58B';

    //chart用データの取得
    <?php
    $select = $_GET['select'];
    if (!isset($select)) {
        $select = 'latest';
    }

    try {
        $db = new PDO($dsn, $user, $password);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        // 最新7日
        if ($select == 'latest') {
            $stmt = $db->prepare("
            select
                t.device
                , t.temp
                , t.volt
                , t.distance
                , t.create_time
                , m.description
                , m.sub_description
                , m.lat
                , m.long
                , m.reference_line
                , m.normally_level        
                , m.attention_level
                , m.alert_level
                , m.picture 
            from
                sigfox_db t 
                left join sigfox_device m 
                    on t.device = m.device 
            where
                DATE_FORMAT(t.create_time, '%Y%m%d') >= :date_sel 
            order by
                t.device
                , t.create_time");

        $date_sel = date("Ymd",strtotime("-7 day"));
        $stmt->bindParam(':date_sel', $date_sel, PDO::PARAM_INT);

        // 当月
        } elseif ($select == 'thisMonth') {
            $stmt = $db->prepare("
            select
                t.device
                , t.temp
                , t.volt
                , t.distance
                , t.create_time
                , m.description
                , m.sub_description
                , m.lat
                , m.long
                , m.reference_line
                , m.normally_level        
                , m.attention_level
                , m.alert_level
                , m.picture 
            from
                sigfox_db t 
                left join sigfox_device m 
                    on t.device = m.device 
            where
                DATE_FORMAT(t.create_time, '%Y%m') = :date_sel 
            order by
                t.device
                , t.create_time");

            $date_sel = date("Ym");
            $stmt->bindParam(':date_sel', $date_sel, PDO::PARAM_INT);

        // 前月
        } elseif ($select == 'lastMonth') {
            $stmt = $db->prepare("
            select
                t.device
                , t.temp
                , t.volt
                , t.distance
                , t.create_time
                , m.description
                , m.sub_description
                , m.lat
                , m.long
                , m.reference_line
                , m.normally_level
                , m.attention_level
                , m.alert_level
                , m.picture 
            from
                sigfox_db t 
                left join sigfox_device m 
                    on t.device = m.device 
            where
                DATE_FORMAT(t.create_time, '%Y%m') = :date_sel 
            order by
                t.device
                , t.create_time");

            $date_sel = date("Ym",strtotime("-1 month"));
            $stmt->bindParam(':date_sel', $date_sel, PDO::PARAM_INT);

        // 当年
        } elseif ($select == 'thisYear') {
            $stmt = $db->prepare("
            select
                t.device
                , t.temp
                , t.volt
                , t.distance
                , t.create_time
                , m.description
                , m.sub_description
                , m.lat
                , m.long
                , m.reference_line
                , m.normally_level        
                , m.attention_level
                , m.alert_level
                , m.picture 
            from
                sigfox_db t 
                left join sigfox_device m 
                    on t.device = m.device 
            where
                DATE_FORMAT(t.create_time, '%Y') = :date_sel 
            order by
                t.device
                , t.create_time");

            $date_sel = date("Y");
            $stmt->bindParam(':date_sel', $date_sel, PDO::PARAM_INT);

        // 前年
        } elseif ($select == 'lastYear') {
            $stmt = $db->prepare("
            select
                t.device
                , t.temp
                , t.volt
                , t.distance
                , t.create_time
                , m.description
                , m.sub_description
                , m.lat
                , m.long
                , m.reference_line
                , m.normally_level        
                , m.attention_level
                , m.alert_level
                , m.picture 
            from
                sigfox_db t 
                left join sigfox_device m 
                    on t.device = m.device 
            where
                DATE_FORMAT(t.create_time, '%Y') = :date_sel 
            order by
                t.device
                , t.create_time");

            $date_sel = date("Y",strtotime("-1 year"));
            $stmt->bindParam(':date_sel', $date_sel, PDO::PARAM_INT);

        };

        $stmt->execute();
        $data1 = array();
        $count = $stmt->rowCount();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data1[] = $row;
        }
        } catch (PDOException $e) {
            die('エラー:' . $e->getMesssage());
        }

        // グラフの横軸ラベル
        foreach ($data1 as $row) {
            echo "labels_all.push('" . $row['create_time'] . "');";
        }

        foreach ($data1 as $row) {
            echo "device.push('" . $row['device'] . "');";
        }
    ?>

    // グラフ(左～)のラベル
    const label1 = '水位計';
    const label2 = '温度計';
    const label3 = '平常時';
    const label4 = '注意レベル';
    const label5 = '警報レベル';

    // グラフのデータ
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    let data5 = [];

    let data1_all = [];
    let data2_all = [];
    let data3_all = [];
    let data4_all = [];
    let data5_all = [];

    let device_description_all = [];
    let device_description = '';

    <?php
        foreach ($data1 as $row) {
            $waterLevel = $row['reference_line'] - $row['distance'];
            // echo "data1_all.push('" . $row['distance'] . "');";
            echo "data1_all.push('" . $waterLevel . "');";
        }
        foreach ($data1 as $row) {
            echo "data2_all.push('" . $row['temp'] . "');";
        }
        foreach ($data1 as $row) {
            echo "data3_all.push('" . $row['normally_level'] . "');";
        }
        foreach ($data1 as $row) {
            echo "data4_all.push('" . $row['attention_level'] . "');";
        }
        foreach ($data1 as $row) {
            echo "data5_all.push('" . $row['alert_level'] . "');";
        }
        foreach ($data1 as $row) {
            echo "device_description_all.push('" . $row['description'] ."　". $row['sub_description'] ."');";
        }
    ?>

    // チャート表示用データへセット
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

    // console.log("device",device);s

    $(function() {
        $('#device-description').replaceWith('<h4 id="device-description">' + device_description + '</h4>');
    });
    </script>

    <script src="js/sgChart1.js"></script>

    <script>
    feather.replace()
    </script>

    <script src="js/sgMapcode1.js"></script>

</body>

</html>