// Tabulatorのコンポーネントを操作する
//
// 参考URL
// https://tabulator.info/
// https://oopsoop.com/tabulator/#:~:text=%E3%81%93%E3%81%93%E3%81%A7%E3%81%AF%E3%80%81CDN%E3%82%92%E4%BD%BF

// Tabulatorのコンポーネントはグローバル変数として定義する。
var table;

// TabulatorのHeader部の最小値・最大値のフィルターコンポーネントを生成。
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){
    var end;
    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 1000000);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";
    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }
    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");
    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);
    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);
    container.appendChild(start);
    container.appendChild(end);

    return container;
 }

// フィルター用数字範囲チェック関数（Exampleのコーディング）
// 大小関係をチェックする場合、文字と数字が混在して比較するのも有効としていた。
// ※このやり方でも悪くはない。
function minMaxFilterFunction_old(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    if(rowValue){
        if(headerValue.start != "") {
            if(headerValue.end != "") {
                return rowValue >= headerValue.start && rowValue <= headerValue.end;
            }else{
                return rowValue >= headerValue.start;
            }
        }
        else {
            if(headerValue.end != "") {
                return rowValue <= headerValue.end;
            }
        }
    }

    return true; //must return a boolean, true if it passes the filter.
}

// フィルター用数字範囲チェック関数（修正版）
// 大小関係をチェックする場合、一旦、数字に変換する。
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    if(rowValue) {
        var i_value = parseInt(rowValue)
        if(headerValue.start != "") {
            var i_start = parseInt(headerValue.start)
            if(headerValue.end != "") {
                var i_end = parseInt(headerValue.end)
                return i_value >= i_start && i_value <= i_end;
            }
            else{
                return i_value >= i_start;
            }
        }else{
            if(headerValue.end != "") {
                var i_end = parseInt(headerValue.end)
                return i_value <= i_end;
            }
        }
    }

    return true; //must return a boolean, true if it passes the filter.
}

// データ取得／Tabulatorのコンポーネントを生成する。
document.getElementById('fetch-data-btn').addEventListener('click', function() {
    $.ajax({
        //url: 'static/data/data.json',
        url: 'https://1jios0mkm5.execute-api.ap-northeast-1.amazonaws.com/test-1/CPD-API-GET-Measurement-data',
        method: 'GET',
        dataType: 'json',
        headers:{
            'x-api-key': 'zkxs3TOKKI6VaXaoo4sF16yl0j3yxYxP4QnOPsPp',
        },

        success: function(tabledata) {
            console.log('データの取得に成功しました:', tabledata);
            // Tabulatorのコンポーネントをグローバル変数として退避する。
            table = new Tabulator("#example-table", {
                height:"311px",
                //layout:"fitColumns",
                data: tabledata,            //assign data to table
                //autoColumns: true,        //create columns from data field names
                //layout:"fitColumns",      //fit columns to width of table
                //responsiveLayout:"hide",  //hide columns that don't fit on the table
                //addRowPos:"top",          //when adding a new row, add it to the top of the table
                //history:true,             //allow undo and redo actions on the table
                //pagination:"local",       //paginate the data
                //paginationSize:7,         //allow 7 rows per page of data
                //paginationCounter:"rows", //display count of paginated rows in footer
                //movableColumns:true,        //allow column order to be changed
                //initialSort:[             //set the initial sort order of the data
                //    {column:"name", dir:"asc"},
                //],
                //columnDefaults:{
                //    tooltip:true,           //show tool tips on cells
                columns:[
                    {title:"SensorType",       field:"sensortype",       headerFilter:"input"},
                    {title:"SensorID",         field:"sensorid",         headerFilter:"input"},
                    {title:"RecorderType",     field:"recordertype",     headerFilter:"input"},
                    {title:"RecorderVersion",  field:"recorderversion",  headerFilter:"input"},
                    {title:"EIRPValue",        field:"eirpvalue",        headerFilter:"input"},
                    {title:"VayyarEVKVersion", field:"vayyarevkversion", headerFilter:"input"},
                    {title:"Vehicle",          field:"vehicle",          headerFilter:"input"},
                    {title:"SensorPosition",   field:"sensorposition",   headerFilter:"input"},
                    {title:"Date",             field:"date",             headerFilter:"input"},
                    {title:"TestID",           field:"testid",           width:200,  headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false},
                    {title:"EngineStatus",     field:"enginestatus",     headerFilter:"input"},
                    {title:"RoadStatus",       field:"roadstatus",       headerFilter:"input"},
                    {title:"RunStatus",        field:"runstatus",        headerFilter:"input"},
                    {title:"TargetNum",        field:"targetnum",        headerFilter:"input"},
                    {title:"TargetPosition",   field:"targetposition",   headerFilter:"input"},
                    {title:"SeatSlide",        field:"seatslide",        headerFilter:"input"},
                    {title:"SeatReclining",    field:"seatreclining",    headerFilter:"input"},
                    {title:"TargetCategory",   field:"targetcategory",   headerFilter:"input"},
                    {title:"FreeComment",      field:"freecomment",      headerFilter:"input"},
                ],
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('データ取得エラー:', textStatus, errorThrown);
        }
    });
});

// データクリア／Tabulatorのコンポーネントをデストロイする。
document.getElementById('clear-table-btn').addEventListener('click', function() {
    if (typeof table !== 'undefined') {
        // Tabulatorのコンポーネントをデストロイする。
        table.destroy();
        table = null;
        console.log('Tabulatorのコンポーネントを削除しました');
    } else {
        console.log('Tabulatorのコンポーネントが見つかりませんでした');
    }
});
